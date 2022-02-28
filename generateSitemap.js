const fs = require("fs");
const axios = require("axios");
const envConfig = require("./src/config");
const apiDomain = envConfig.apidomain;
const domain = envConfig.domain;
const header = '<?xml version="1.0" encoding="UTF-8"?>';
const newLine = '\r\n';


const Sitemaps = {
    header: "sitemap-header.xml",
    footer: "sitemap-footer.xml"
};
function generateXML(urls, name, priority) {
    const offset = new Date().getTimezoneOffset();
    let lastMod = new Date(new Date().getTime() - offset*60*1000).toISOString().split('T')[0];
    let content = '';
    urls.forEach(url => {
        content += '<url>' + newLine + '<loc>' + url + '</loc>' + newLine + '<lastmod>' + lastMod + '</lastmod>' + newLine + '<changefreq>weekly</changefreq>' + newLine + '<priority>' + priority + '</priority>' + newLine + '</url>' + newLine;
    })
    content = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + newLine + content + '</urlset>';
    content = '<?xml version="1.0" encoding="UTF-8"?>' + newLine + content;
    fs.writeFile('./dist/' + name, content, (err) => {
        if(err) throw err;
        console.log("generated " + name + "\n");
    });
}
function generateMain() {
    let content = '';
    try {
        Object.keys(Sitemaps).forEach(key => {
            let sitemap = '<loc>' + domain + '/'+ Sitemaps[key] + '</loc>' + newLine;
            sitemap = '<sitemap>' + newLine + sitemap + '</sitemap>' + newLine;
            content += sitemap;
        })
        content = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + newLine + content + '</sitemapindex>';
        fs.writeFile('./dist/sitemap.xml', content, (err) => {
            if(err) throw err;
            console.log("generated sitemap!");
        });
    } catch(err) {
        console.log(err);
    }

}
function encodeStr(rawStr) {
    const encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
     });
     return encodedStr;
}
function generateHeader() {
    const urls = [];
    axios.get(apiDomain + '/myapi/category/megamenu')
    .then(res => {
        res.data.data.forEach(l1 => {
            l1.url && urls.push(domain + encodeStr(l1.url));
            l1.columns.forEach(column => {
                column.templates.forEach(template => {
                    template.templateData.componentData.link && urls.push(domain + encodeStr(template.templateData.componentData.link));
                    template.templateData.children.forEach(child => {
                        child.componentData.link && urls.push(domain + encodeStr(child.componentData.link));
                    });
                });
            });
        });
        generateXML(urls, Sitemaps.header, 1);
    })
    .catch(err => {
        console.log("Error: " + err);
    });
}
function generateFooter() {
    const urls = [];
    axios.get(apiDomain + '/myapi/category/footer')
    .then(res => {
        res.data.footerList.forEach(column => {
            column.forEach(item => {
                item.link && urls.push(domain + encodeStr(item.link));
                item.value.forEach(value => {
                    value.link && urls.push(domain + encodeStr(value.link));
                });
            });
        });
        generateXML(urls, Sitemaps.footer, 1);
    })
    .catch(err => {
        console.log("Error: " + err);
    });
}

// generate sitemap files
generateMain();
generateHeader();
generateFooter();
