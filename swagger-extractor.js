#!/usr/bin/env node

/**
 * أداة لاستخراج Swagger/OpenAPI من الخادم المباشر
 * Direct Swagger/OpenAPI Extraction Tool
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class SwaggerExtractor {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.outputDir = path.join(__dirname, 'api-exports');
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }
  }

  // جلب Swagger JSON من الخادم
  async fetchSwaggerSpec() {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/docs-json`;
      const client = this.baseUrl.startsWith('https') ? https : http;
      
      console.log(`🌐 جاري جلب Swagger spec من: ${url}`);
      
      client.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const spec = JSON.parse(data);
            resolve(spec);
          } catch (error) {
            reject(new Error(`خطأ في تحليل JSON: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`خطأ في الاتصال: ${error.message}`));
      });
    });
  }

  // تحويل Swagger إلى تنسيقات مختلفة
  convertSwagger(spec) {
    const formats = {};
    
    // JSON مُنسق
    formats.json = JSON.stringify(spec, null, 2);
    
    // YAML (تقريبي)
    formats.yaml = this.jsonToYaml(spec);
    
    // Markdown Documentation
    formats.markdown = this.swaggerToMarkdown(spec);
    
    // Insomnia Collection
    formats.insomnia = this.swaggerToInsomnia(spec);
    
    // أوامر cURL
    formats.curl = this.swaggerToCurl(spec);
    
    // قائمة Endpoints بسيطة
    formats.endpoints = this.extractEndpointsList(spec);
    
    return formats;
  }

  // تحويل JSON إلى YAML تقريبي
  jsonToYaml(obj, indent = 0) {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        yaml += `${spaces}${key}: null\n`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            yaml += `${spaces}- \n${this.jsonToYaml(item, indent + 1)}`;
          } else {
            yaml += `${spaces}- ${item}\n`;
          }
        });
      } else if (typeof value === 'object') {
        yaml += `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }

  // تحويل إلى Markdown
  swaggerToMarkdown(spec) {
    let md = `# ${spec.info.title}\n\n`;
    md += `${spec.info.description}\n\n`;
    md += `**Version:** ${spec.info.version}\n\n`;
    
    if (spec.servers) {
      md += `## Servers\n\n`;
      spec.servers.forEach(server => {
        md += `- **${server.description || 'Server'}:** ${server.url}\n`;
      });
      md += '\n';
    }
    
    md += `## Endpoints\n\n`;
    
    Object.entries(spec.paths || {}).forEach(([path, methods]) => {
      md += `### ${path}\n\n`;
      
      Object.entries(methods).forEach(([method, details]) => {
        md += `#### ${method.toUpperCase()}\n\n`;
        
        if (details.summary) {
          md += `**Summary:** ${details.summary}\n\n`;
        }
        
        if (details.description) {
          md += `**Description:** ${details.description}\n\n`;
        }
        
        if (details.tags) {
          md += `**Tags:** ${details.tags.join(', ')}\n\n`;
        }
        
        if (details.parameters) {
          md += `**Parameters:**\n`;
          details.parameters.forEach(param => {
            md += `- **${param.name}** (${param.in}): ${param.description || 'No description'}\n`;
          });
          md += '\n';
        }
        
        if (details.responses) {
          md += `**Responses:**\n`;
          Object.entries(details.responses).forEach(([code, response]) => {
            md += `- **${code}:** ${response.description || 'No description'}\n`;
          });
          md += '\n';
        }
        
        md += '---\n\n';
      });
    });
    
    return md;
  }

  // تحويل إلى Insomnia Collection
  swaggerToInsomnia(spec) {
    const collection = {
      _type: 'export',
      __export_format: 4,
      __export_date: new Date().toISOString(),
      __export_source: 'infinity-ai-system',
      resources: []
    };

    // مجلد رئيسي
    const mainFolder = {
      _id: 'main_folder',
      _type: 'request_group',
      name: spec.info.title,
      description: spec.info.description,
      environment: {},
      environmentPropertyOrder: null,
      metaSortKey: -1
    };
    collection.resources.push(mainFolder);

    // متغيرات البيئة
    const environment = {
      _id: 'base_environment',
      _type: 'environment',
      name: 'Base Environment',
      data: {
        base_url: spec.servers?.[0]?.url || 'http://localhost:3000',
        token: ''
      },
      dataPropertyOrder: ['base_url', 'token'],
      color: null,
      isPrivate: false,
      metaSortKey: 1
    };
    collection.resources.push(environment);

    // إضافة الطلبات
    let sortKey = 1;
    Object.entries(spec.paths || {}).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        const request = {
          _id: `req_${sortKey++}`,
          _type: 'request',
          parentId: 'main_folder',
          name: details.summary || `${method.toUpperCase()} ${path}`,
          description: details.description || '',
          url: `{{ _.base_url }}${path}`,
          method: method.toUpperCase(),
          headers: [
            {
              name: 'Content-Type',
              value: 'application/json'
            }
          ],
          authentication: {
            type: 'bearer',
            token: '{{ _.token }}'
          },
          body: {},
          parameters: [],
          settingStoreCookies: true,
          settingSendCookies: true,
          metaSortKey: sortKey
        };

        // إضافة parameters
        if (details.parameters) {
          details.parameters.forEach(param => {
            if (param.in === 'query') {
              request.parameters.push({
                name: param.name,
                value: '',
                description: param.description || ''
              });
            }
          });
        }

        collection.resources.push(request);
      });
    });

    return JSON.stringify(collection, null, 2);
  }

  // تحويل إلى cURL
  swaggerToCurl(spec) {
    let curl = `# cURL Commands for ${spec.info.title}\n\n`;
    curl += `# Set your base URL and token\n`;
    curl += `BASE_URL="${spec.servers?.[0]?.url || 'http://localhost:3000'}"\n`;
    curl += `TOKEN="your_jwt_token_here"\n\n`;
    
    Object.entries(spec.paths || {}).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        curl += `# ${details.summary || `${method.toUpperCase()} ${path}`}\n`;
        curl += `curl -X ${method.toUpperCase()} \\\n`;
        curl += `  "$BASE_URL${path}" \\\n`;
        curl += `  -H "Content-Type: application/json" \\\n`;
        curl += `  -H "Authorization: Bearer $TOKEN"`;
        
        if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
          curl += ` \\\n  -d '{}'`;
        }
        
        curl += `\n\n`;
      });
    });
    
    return curl;
  }

  // استخراج قائمة endpoints بسيطة
  extractEndpointsList(spec) {
    const endpoints = [];
    
    Object.entries(spec.paths || {}).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        endpoints.push({
          method: method.toUpperCase(),
          path: path,
          summary: details.summary || '',
          description: details.description || '',
          tags: details.tags || [],
          operationId: details.operationId || ''
        });
      });
    });
    
    return JSON.stringify({
      info: spec.info,
      totalEndpoints: endpoints.length,
      extractedAt: new Date().toISOString(),
      endpoints: endpoints
    }, null, 2);
  }

  // حفظ جميع التنسيقات
  async saveAllFormats() {
    try {
      console.log('🚀 بدء استخراج Swagger spec...\n');
      
      const spec = await this.fetchSwaggerSpec();
      console.log(`✅ تم جلب Swagger spec بنجاح`);
      console.log(`📊 عدد المسارات: ${Object.keys(spec.paths || {}).length}`);
      
      const formats = this.convertSwagger(spec);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const savedFiles = [];
      
      // حفظ كل تنسيق
      Object.entries(formats).forEach(([format, content]) => {
        try {
          const extension = format === 'insomnia' ? 'json' : format;
          const fileName = `swagger-${format}-${timestamp}.${extension}`;
          const filePath = path.join(this.outputDir, fileName);
          
          fs.writeFileSync(filePath, content);
          savedFiles.push(fileName);
          console.log(`✅ تم حفظ ${format}: ${fileName}`);
        } catch (error) {
          console.error(`❌ خطأ في حفظ ${format}:`, error.message);
        }
      });
      
      console.log(`\n🎉 تم حفظ ${savedFiles.length} ملف في مجلد: ${this.outputDir}`);
      return savedFiles;
      
    } catch (error) {
      console.error('❌ خطأ في استخراج Swagger:', error.message);
      console.log('\n💡 تأكد من أن الخادم يعمل على: http://localhost:3000');
      console.log('💡 يمكنك تشغيل الخادم بالأمر: npm run start:dev');
    }
  }
}

// تشغيل الأداة
const extractor = new SwaggerExtractor();
extractor.saveAllFormats();

module.exports = SwaggerExtractor;
