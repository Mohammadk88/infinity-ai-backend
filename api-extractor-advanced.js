#!/usr/bin/env node

/**
 * أداة تفاعلية لاستخراج API - Infinity AI System
 * Interactive API Extraction Tool
 */

const fs = require('fs');
const path = require('path');

class AdvancedAPIExtractor {
  constructor() {
    this.endpoints = [];
    this.loadExtractedData();
  }

  // تحميل البيانات المستخرجة مسبقاً
  loadExtractedData() {
    try {
      const exportsDir = path.join(__dirname, 'api-exports');
      const files = fs.readdirSync(exportsDir);
      const latestJsonFile = files
        .filter(f => f.startsWith('api-endpoints-') && f.endsWith('.json'))
        .sort()
        .pop();
      
      if (latestJsonFile) {
        const data = JSON.parse(fs.readFileSync(path.join(exportsDir, latestJsonFile), 'utf8'));
        this.endpoints = data.endpoints;
        console.log(`✅ تم تحميل ${this.endpoints.length} endpoint من ${latestJsonFile}`);
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات:', error.message);
    }
  }

  // فلترة حسب الوحدة
  filterByModule(moduleName) {
    return this.endpoints.filter(ep => 
      ep.module.toLowerCase().includes(moduleName.toLowerCase())
    );
  }

  // فلترة حسب HTTP method
  filterByMethod(method) {
    return this.endpoints.filter(ep => 
      ep.method.toLowerCase() === method.toLowerCase()
    );
  }

  // فلترة حسب المسار
  filterByPath(pathPattern) {
    return this.endpoints.filter(ep => 
      ep.path.toLowerCase().includes(pathPattern.toLowerCase())
    );
  }

  // البحث في الوصف
  searchInSummary(searchTerm) {
    return this.endpoints.filter(ep => 
      ep.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // تصدير مخصص حسب الفلتر
  exportFiltered(filter, format = 'json') {
    let filteredEndpoints = [];
    
    switch (filter.type) {
      case 'module':
        filteredEndpoints = this.filterByModule(filter.value);
        break;
      case 'method':
        filteredEndpoints = this.filterByMethod(filter.value);
        break;
      case 'path':
        filteredEndpoints = this.filterByPath(filter.value);
        break;
      case 'search':
        filteredEndpoints = this.searchInSummary(filter.value);
        break;
      default:
        filteredEndpoints = this.endpoints;
    }

    const data = {
      filter: filter,
      totalEndpoints: filteredEndpoints.length,
      exportedAt: new Date().toISOString(),
      endpoints: filteredEndpoints
    };

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(filteredEndpoints);
      case 'markdown':
        return this.convertToMarkdown(filteredEndpoints, filter);
      case 'postman':
        return this.convertToPostman(filteredEndpoints);
      case 'curl':
        return this.convertToCurl(filteredEndpoints);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  // تحويل إلى CSV
  convertToCSV(endpoints) {
    let csv = 'Method,Path,Handler,Summary,Tags,Module\n';
    endpoints.forEach(ep => {
      csv += `${ep.method},"${ep.path}","${ep.handler}","${ep.summary}","${ep.tags}","${ep.module}"\n`;
    });
    return csv;
  }

  // تحويل إلى Markdown
  convertToMarkdown(endpoints, filter) {
    let md = `# API Endpoints - ${filter.type}: ${filter.value}\n\n`;
    md += `**Total Endpoints:** ${endpoints.length}\n\n`;
    
    endpoints.forEach(ep => {
      md += `## ${ep.method} ${ep.path}\n`;
      md += `- **Handler:** ${ep.handler}\n`;
      md += `- **Summary:** ${ep.summary}\n`;
      md += `- **Module:** ${ep.module}\n`;
      md += `- **Tags:** ${ep.tags}\n\n`;
    });
    
    return md;
  }

  // تحويل إلى Postman Collection
  convertToPostman(endpoints) {
    const collection = {
      info: {
        name: "Infinity AI System API",
        description: "API Collection for Infinity AI System",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [],
      variable: [
        {
          key: "baseUrl",
          value: "http://localhost:3000",
          type: "string"
        }
      ]
    };

    // تجميع حسب الوحدة
    const groupedByModule = {};
    endpoints.forEach(ep => {
      if (!groupedByModule[ep.module]) {
        groupedByModule[ep.module] = [];
      }
      groupedByModule[ep.module].push(ep);
    });

    Object.entries(groupedByModule).forEach(([module, eps]) => {
      const folder = {
        name: module.charAt(0).toUpperCase() + module.slice(1),
        item: []
      };

      eps.forEach(ep => {
        folder.item.push({
          name: `${ep.method} ${ep.path}`,
          request: {
            method: ep.method,
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{token}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}" + ep.path,
              host: ["{{baseUrl}}"],
              path: ep.path.split('/').filter(p => p)
            },
            description: ep.summary
          }
        });
      });

      collection.item.push(folder);
    });

    return JSON.stringify(collection, null, 2);
  }

  // تحويل إلى cURL commands
  convertToCurl(endpoints) {
    let curlCommands = `# cURL Commands for Infinity AI System API\n\n`;
    curlCommands += `# Set your base URL and token\n`;
    curlCommands += `BASE_URL="http://localhost:3000"\n`;
    curlCommands += `TOKEN="your_jwt_token_here"\n\n`;
    
    endpoints.forEach(ep => {
      curlCommands += `# ${ep.summary || ep.handler}\n`;
      curlCommands += `curl -X ${ep.method} \\\n`;
      curlCommands += `  "$BASE_URL${ep.path}" \\\n`;
      curlCommands += `  -H "Content-Type: application/json" \\\n`;
      curlCommands += `  -H "Authorization: Bearer $TOKEN"`;
      
      if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
        curlCommands += ` \\\n  -d '{}'`;
      }
      
      curlCommands += `\n\n`;
    });
    
    return curlCommands;
  }

  // إحصائيات مفصلة
  getDetailedStats() {
    const stats = {
      total: this.endpoints.length,
      byMethod: {},
      byModule: {},
      byTags: {},
      authRequired: 0,
      publicEndpoints: 0
    };

    this.endpoints.forEach(ep => {
      // حسب HTTP Method
      stats.byMethod[ep.method] = (stats.byMethod[ep.method] || 0) + 1;
      
      // حسب الوحدة
      stats.byModule[ep.module] = (stats.byModule[ep.module] || 0) + 1;
      
      // حسب Tags
      stats.byTags[ep.tags] = (stats.byTags[ep.tags] || 0) + 1;
      
      // تقدير المسارات التي تحتاج مصادقة (تحتوي على معرفات)
      if (ep.path.includes(':id') || ep.path.includes('/me') || 
          !['/', '/auth/login', '/auth/register'].includes(ep.path)) {
        stats.authRequired++;
      } else {
        stats.publicEndpoints++;
      }
    });

    return stats;
  }

  // طباعة الإحصائيات
  printStats() {
    const stats = this.getDetailedStats();
    
    console.log('\n📊 إحصائيات تفصيلية للـ API:\n');
    console.log(`🔗 إجمالي Endpoints: ${stats.total}`);
    console.log(`🔒 تحتاج مصادقة: ${stats.authRequired}`);
    console.log(`🌐 عامة: ${stats.publicEndpoints}\n`);
    
    console.log('📋 توزيع HTTP Methods:');
    Object.entries(stats.byMethod)
      .sort(([,a], [,b]) => b - a)
      .forEach(([method, count]) => {
        console.log(`   ${method}: ${count}`);
      });
    
    console.log('\n📁 أكثر الوحدات نشاطاً:');
    Object.entries(stats.byModule)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([module, count]) => {
        console.log(`   ${module}: ${count} endpoints`);
      });
  }

  // حفظ بصيغ متعددة
  saveInMultipleFormats(filter = { type: 'all', value: 'all' }) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, 'api-exports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const formats = ['json', 'csv', 'markdown', 'postman', 'curl'];
    const savedFiles = [];

    formats.forEach(format => {
      try {
        const content = this.exportFiltered(filter, format);
        const fileName = `api-${filter.type}-${filter.value}-${timestamp}.${format === 'postman' ? 'json' : format}`;
        const filePath = path.join(outputDir, fileName);
        
        fs.writeFileSync(filePath, content);
        savedFiles.push(fileName);
      } catch (error) {
        console.error(`❌ خطأ في حفظ ${format}:`, error.message);
      }
    });

    console.log(`\n✅ تم حفظ الملفات:`);
    savedFiles.forEach(file => console.log(`   📄 ${file}`));
    
    return savedFiles;
  }
}

// الاستخدام التفاعلي
const extractor = new AdvancedAPIExtractor();

// طباعة الإحصائيات
extractor.printStats();

// أمثلة على الاستخدام
console.log('\n🚀 أمثلة على الاستخدام:\n');

// استخراج endpoints الخاصة بالمصادقة
console.log('🔐 Authentication Endpoints:');
const authEndpoints = extractor.filterByModule('auth');
authEndpoints.forEach(ep => {
  console.log(`   ${ep.method} ${ep.path} - ${ep.summary}`);
});

// استخراج GET endpoints
console.log('\n📥 GET Endpoints (أول 10):');
const getEndpoints = extractor.filterByMethod('GET').slice(0, 10);
getEndpoints.forEach(ep => {
  console.log(`   ${ep.path} - ${ep.summary || ep.handler}`);
});

// حفظ بصيغ متعددة
console.log('\n💾 حفظ جميع البيانات بصيغ متعددة...');
extractor.saveInMultipleFormats();

module.exports = AdvancedAPIExtractor;
