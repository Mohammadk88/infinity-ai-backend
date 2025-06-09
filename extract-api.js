#!/usr/bin/env node

/**
 * أداة استخراج API endpoints من مشروع NestJS
 * Tool to extract API endpoints from NestJS project
 */

const fs = require('fs');
const path = require('path');

class APIExtractor {
  constructor() {
    this.endpoints = [];
    this.controllers = [];
    this.srcPath = path.join(__dirname, 'src');
  }

  // قراءة جميع ملفات الـ controllers
  findControllers(dir = this.srcPath) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.findControllers(fullPath);
      } else if (file.endsWith('.controller.ts')) {
        this.controllers.push(fullPath);
      }
    }
  }

  // استخراج المعلومات من ملف controller
  extractFromController(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.srcPath, filePath);
      const moduleName = relativePath.split('/')[0];
      
      // استخراج اسم الـ controller
      const controllerMatch = content.match(/@Controller\(['"`]([^'"`]*?)['"`]\)/);
      const baseRoute = controllerMatch ? controllerMatch[1] : '';
      
      // استخراج الـ endpoints
      const methodRegex = /@(Get|Post|Put|Patch|Delete)\(['"`]?([^'"`\)]*?)['"`]?\)[\s\S]*?(\w+)\s*\(/g;
      let match;
      
      const endpoints = [];
      
      while ((match = methodRegex.exec(content)) !== null) {
        const [, httpMethod, route, methodName] = match;
        
        // استخراج معلومات إضافية
        const beforeMethod = content.substring(0, match.index);
        const apiOperationMatch = beforeMethod.match(/@ApiOperation\(\{\s*summary:\s*['"`]([^'"`]*?)['"`]/);
        const apiTagsMatch = content.match(/@ApiTags\(['"`]([^'"`]*?)['"`]\)/);
        
        // تحديد الـ route الكامل
        let fullRoute = baseRoute;
        if (route && route !== '') {
          fullRoute = fullRoute ? `/${baseRoute}/${route}` : `/${route}`;
        } else if (baseRoute) {
          fullRoute = `/${baseRoute}`;
        }
        
        // تنظيف الـ route من العلامات المكررة
        fullRoute = fullRoute.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
        
        endpoints.push({
          method: httpMethod.toUpperCase(),
          path: fullRoute,
          handler: methodName,
          summary: apiOperationMatch ? apiOperationMatch[1] : '',
          tags: apiTagsMatch ? apiTagsMatch[1] : moduleName,
          module: moduleName,
          file: relativePath
        });
      }
      
      return endpoints;
    } catch (error) {
      console.error(`خطأ في قراءة الملف ${filePath}:`, error.message);
      return [];
    }
  }

  // استخراج جميع الـ endpoints
  extractAllEndpoints() {
    this.findControllers();
    
    for (const controllerPath of this.controllers) {
      const endpoints = this.extractFromController(controllerPath);
      this.endpoints.push(...endpoints);
    }
    
    // ترتيب الـ endpoints
    this.endpoints.sort((a, b) => {
      if (a.path !== b.path) {
        return a.path.localeCompare(b.path);
      }
      return a.method.localeCompare(b.method);
    });
    
    return this.endpoints;
  }

  // تصدير كـ JSON
  exportAsJSON() {
    return JSON.stringify({
      project: "Infinity AI System Backend",
      version: "1.0.0",
      totalEndpoints: this.endpoints.length,
      extractedAt: new Date().toISOString(),
      endpoints: this.endpoints
    }, null, 2);
  }

  // تصدير كـ OpenAPI/Swagger
  exportAsOpenAPI() {
    const groupedByTag = {};
    
    this.endpoints.forEach(endpoint => {
      if (!groupedByTag[endpoint.tags]) {
        groupedByTag[endpoint.tags] = [];
      }
      groupedByTag[endpoint.tags].push(endpoint);
    });

    const openAPI = {
      openapi: "3.0.0",
      info: {
        title: "Infinity AI System API",
        description: "Complete API documentation for Infinity AI System Backend",
        version: "1.0.0"
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server"
        }
      ],
      paths: {}
    };

    this.endpoints.forEach(endpoint => {
      if (!openAPI.paths[endpoint.path]) {
        openAPI.paths[endpoint.path] = {};
      }
      
      openAPI.paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary || `${endpoint.method} ${endpoint.path}`,
        tags: [endpoint.tags],
        operationId: endpoint.handler,
        responses: {
          "200": {
            description: "Success"
          }
        }
      };
    });

    return JSON.stringify(openAPI, null, 2);
  }

  // تصدير كـ Markdown
  exportAsMarkdown() {
    let markdown = `# Infinity AI System - API Documentation\n\n`;
    markdown += `**Total Endpoints:** ${this.endpoints.length}\n`;
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    // تجميع حسب الوحدة
    const groupedByModule = {};
    this.endpoints.forEach(endpoint => {
      if (!groupedByModule[endpoint.module]) {
        groupedByModule[endpoint.module] = [];
      }
      groupedByModule[endpoint.module].push(endpoint);
    });

    Object.entries(groupedByModule).forEach(([module, endpoints]) => {
      markdown += `## ${module.charAt(0).toUpperCase() + module.slice(1)} Module\n\n`;
      
      endpoints.forEach(endpoint => {
        markdown += `### ${endpoint.method} ${endpoint.path}\n`;
        if (endpoint.summary) {
          markdown += `**Description:** ${endpoint.summary}\n`;
        }
        markdown += `**Handler:** ${endpoint.handler}\n`;
        markdown += `**File:** ${endpoint.file}\n\n`;
      });
    });

    return markdown;
  }

  // تصدير كـ CSV
  exportAsCSV() {
    let csv = 'Method,Path,Handler,Summary,Tags,Module,File\n';
    
    this.endpoints.forEach(endpoint => {
      const row = [
        endpoint.method,
        endpoint.path,
        endpoint.handler,
        `"${endpoint.summary}"`,
        endpoint.tags,
        endpoint.module,
        endpoint.file
      ].join(',');
      csv += row + '\n';
    });

    return csv;
  }

  // حفظ الملفات
  saveFiles() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, 'api-exports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // JSON
    fs.writeFileSync(
      path.join(outputDir, `api-endpoints-${timestamp}.json`),
      this.exportAsJSON()
    );

    // OpenAPI
    fs.writeFileSync(
      path.join(outputDir, `openapi-spec-${timestamp}.json`),
      this.exportAsOpenAPI()
    );

    // Markdown
    fs.writeFileSync(
      path.join(outputDir, `api-documentation-${timestamp}.md`),
      this.exportAsMarkdown()
    );

    // CSV
    fs.writeFileSync(
      path.join(outputDir, `api-endpoints-${timestamp}.csv`),
      this.exportAsCSV()
    );

    console.log(`✅ تم حفظ الملفات في مجلد: ${outputDir}`);
    console.log(`📊 تم استخراج ${this.endpoints.length} endpoint`);
  }
}

// تشغيل الأداة
const extractor = new APIExtractor();
extractor.extractAllEndpoints();

// طباعة ملخص
console.log('\n🚀 استخراج API Endpoints - Infinity AI System\n');
console.log(`📁 تم فحص ${extractor.controllers.length} controller`);
console.log(`🔗 تم العثور على ${extractor.endpoints.length} endpoint\n`);

// عرض ملخص سريع
const groupedByModule = {};
extractor.endpoints.forEach(endpoint => {
  if (!groupedByModule[endpoint.module]) {
    groupedByModule[endpoint.module] = 0;
  }
  groupedByModule[endpoint.module]++;
});

console.log('📋 توزيع الـ Endpoints حسب الوحدة:');
Object.entries(groupedByModule).forEach(([module, count]) => {
  console.log(`   ${module}: ${count} endpoints`);
});

// حفظ الملفات
extractor.saveFiles();

module.exports = APIExtractor;
