// netlify/edge-functions/ip-geo.js

const COUNTRY_MAP = {
  AF: "🇦🇫 阿富汗", AL: "🇦🇱 阿尔巴尼亚", DZ: "🇩🇿 阿尔及利亚", AS: "🇦🇸 美属萨摩亚", AD: "🇦🇩 安道尔",
  AO: "🇦🇴 安哥拉", AI: "🇦🇮 安圭拉", AQ: "🇦🇶 南极洲", AG: "🇦🇬 安提瓜和巴布达", AR: "🇦🇷 阿根廷",
  AM: "🇦🇲 亚美尼亚", AW: "🇦🇼 阿鲁巴", AU: "🇦🇺 澳大利亚", AT: "🇦🇹 奥地利", AZ: "🇦🇿 阿塞拜疆",
  BS: "🇧🇸 巴哈马", BH: "🇧🇭 巴林", BD: "🇧🇩 孟加拉国", BB: "🇧🇧 巴巴多斯", BY: "🇧🇾 白俄罗斯",
  BE: "🇧🇪 比利时", BZ: "🇧🇿 伯利兹", BJ: "🇧🇯 贝宁", BM: "🇧🇲 百慕大", BT: "🇧🇹 不丹",
  BO: "🇧🇴 玻利维亚", BA: "🇧🇦 波斯尼亚和黑塞哥维那", BW: "🇧🇼 博茨瓦纳", BR: "🇧🇷 巴西", BN: "🇧🇳 文莱",
  BG: "🇧🇬 保加利亚", BF: "🇧🇫 布基纳法索", BI: "🇧🇮 布隆迪", KH: "🇰🇭 柬埔寨", CM: "🇨🇲 喀麦隆",
  CA: "🇨🇦 加拿大", CV: "🇨🇻 佛得角", KY: "🇰🇾 开曼群岛", CF: "🇨🇫 中非共和国", TD: "🇹🇩 乍得",
  CL: "🇨🇱 智利", CN: "🇨🇳 中国", HK: "🇭🇰 中国香港", MO: "🇲🇴 中国澳门", TW: "🇹🇼 中国台湾",
  CO: "🇨🇴 哥伦比亚", KM: "🇰🇲 科摩罗", CG: "🇨🇬 刚果(布)", CD: "🇨🇩 刚果(金)", CR: "🇨🇷 哥斯达黎加",
  HR: "🇭🇷 克罗地亚", CU: "🇨🇺 古巴", CY: "🇨🇾 塞浦路斯", CZ: "🇨🇿 捷克", DK: "🇩🇰 丹麦",
  DJ: "🇩🇯 吉布提", DM: "🇩🇲 多米尼克", DO: "🇩🇴 多米尼加共和国", EC: "🇪🇨 厄瓜多尔", EG: "🇪🇬 埃及",
  SV: "🇸🇻 萨尔瓦多", GQ: "🇬🇶 赤道几内亚", ER: "🇪🇷 厄立特里亚", EE: "🇪🇪 爱沙尼亚", ET: "🇪🇹 埃塞俄比亚",
  FJ: "🇫🇯 斐济", FI: "🇫🇮 芬兰", FR: "🇫🇷 法国", GF: "🇬🇫 法属圭亚那", PF: "🇵🇫 法属波利尼西亚",
  GA: "🇬🇦 加蓬", GM: "🇬🇲 冈比亚", GE: "🇬🇪 格鲁吉亚", DE: "🇩🇪 德国", GH: "🇬🇭 加纳",
  GR: "🇬🇷 希腊", GL: "🇬🇱 格陵兰", GD: "🇬🇩 格林纳达", GP: "🇬🇵 瓜德罗普", GT: "🇬🇹 危地马拉",
  GN: "🇬🇳 几内亚", GW: "🇬🇼 几内亚比绍", GY: "🇬🇾 圭亚那", HT: "🇭🇹 海地", HN: "🇭🇳 洪都拉斯",
  HU: "🇭🇺 匈牙利", IS: "🇮🇸 冰岛", IN: "🇮🇳 印度", ID: "🇮🇩 印度尼西亚", IR: "🇮🇷 伊朗",
  IQ: "🇮🇶 伊拉克", IE: "🇮🇪 爱尔兰", IL: "🇮🇱 以色列", IT: "🇮🇹 意大利", JM: "🇯🇲 牙买加",
  JP: "🇯🇵 日本", JO: "🇯🇴 约旦", KZ: "🇰🇿 哈萨克斯坦", KE: "🇰🇪 肯尼亚", KI: "🇰🇮 基里巴斯",
  KR: "🇰🇷 韩国", KW: "🇰🇼 科威特", KG: "🇰🇬 吉尔吉斯斯坦", LA: "🇱🇦 老挝", LV: "🇱🇻 拉脱维亚",
  LB: "🇱🇧 黎巴嫩", LS: "🇱🇸 莱索托", LR: "🇱🇷 利比里亚", LY: "🇱🇾 利比亚", LI: "🇱🇮 列支敦士登",
  LT: "🇱🇹 立陶宛", LU: "🇱🇺 卢森堡", MG: "🇲🇬 马达加斯加", MW: "🇲🇼 马拉维", MY: "🇲🇾 马来西亚",
  MV: "🇲🇻 马尔代夫", ML: "🇲🇱 马里", MT: "🇲🇹 马耳他", MH: "🇲🇭 马绍尔群岛", MQ: "🇲🇶 马提尼克",
  MR: "🇲🇷 毛里塔尼亚", MU: "🇲🇺 毛里求斯", YT: "🇾🇹 马约特", MX: "🇲🇽 墨西哥", FM: "🇫🇲 密克罗尼西亚",
  MD: "🇲🇩 摩尔多瓦", MC: "🇲🇨 摩纳哥", MN: "🇲🇳 蒙古", ME: "🇲🇪 黑山", MA: "🇲🇦 摩洛哥",
  MZ: "🇲🇿 莫桑比克", MM: "🇲🇲 缅甸", NA: "🇳🇦 纳米比亚", NR: "🇳🇷 瑙鲁", NP: "🇳🇵 尼泊尔",
  NL: "🇳🇱 荷兰", NC: "🇳🇨 新喀里多尼亚", NZ: "🇳🇿 新西兰", NI: "🇳🇮 尼加拉瓜", NE: "🇳🇪 尼日尔",
  NG: "🇳🇬 尼日利亚", MK: "🇲🇰 北马其顿", NO: "🇳🇴 挪威", OM: "🇴🇲 阿曼", PK: "🇵🇰 巴基斯坦",
  PW: "🇵🇼 帕劳", PA: "🇵🇦 巴拿马", PG: "🇵🇬 巴布亚新几内亚", PY: "🇵🇾 巴拉圭", PE: "🇵🇪 秘鲁",
  PH: "🇵🇭 菲律宾", PL: "🇵🇱 波兰", PT: "🇵🇹 葡萄牙", QA: "🇶🇦 卡塔尔", RE: "🇷🇪 留尼汪",
  RO: "🇷🇴 罗马尼亚", RU: "🇷🇺 俄罗斯", RW: "🇷🇼 卢旺达", KN: "🇰🇳 圣基茨和尼维斯", LC: "🇱🇨 圣卢西亚",
  VC: "🇻🇨 圣文森特和格林纳丁斯", WS: "🇼🇸 萨摩亚", SM: "🇸🇲 圣马力诺", ST: "🇸🇹 圣多美和普林西比",
  SA: "🇸🇦 沙特阿拉伯", SN: "🇸🇳 塞内加尔", RS: "🇷🇸 塞尔维亚", SC: "🇸🇨 塞舌尔", SL: "🇸🇱 塞拉利昂",
  SG: "🇸🇬 新加坡", SK: "🇸🇰 斯洛伐克", SI: "🇸🇮 斯洛文尼亚", SB: "🇸🇧 所罗门群岛", SO: "🇸🇴 索马里",
  ZA: "🇿🇦 南非", ES: "🇪🇸 西班牙", LK: "🇱🇰 斯里兰卡", SD: "🇸🇩 苏丹", SR: "🇸🇷 苏里南",
  SE: "🇸🇪 瑞典", CH: "🇨🇭 瑞士", SY: "🇸🇾 叙利亚", TH: "🇹🇭 泰国", TL: "🇹🇱 东帝汶",
  TG: "🇹🇬 多哥", TO: "🇹🇴 汤加", TT: "🇹🇹 特立尼达和多巴哥", TN: "🇹🇳 突尼斯", TR: "🇹🇷 土耳其",
  TM: "🇹🇲 土库曼斯坦", TV: "🇹🇻 图瓦卢", UG: "🇺🇬 乌干达", UA: "🇺🇦 乌克兰", AE: "🇦🇪 阿联酋",
  GB: "🇬🇧 英国", US: "🇺🇸 美国", UY: "🇺🇾 乌拉圭", UZ: "🇺🇿 乌兹别克斯坦", VU: "🇻🇺 瓦努阿图",
  VE: "🇻🇪 委内瑞拉", VN: "🇻🇳 越南", YE: "🇾🇪 也门", ZM: "🇿🇲 赞比亚", ZW: "🇿🇼 津巴布韦"
};

const CITY_MAP = {
  "Beijing": "北京", "Shanghai": "上海", "Guangzhou": "广州", "Shenzhen": "深圳",
  "Chengdu": "成都", "Chongqing": "重庆", "Wuhan": "武汉", "Xi'an": "西安",
  "Hangzhou": "杭州", "Nanjing": "南京", "Tianjin": "天津", "Suzhou": "苏州",
  "Tokyo": "东京", "Osaka": "大阪", "Seoul": "首尔", "Busan": "釜山",
  "Singapore": "新加坡", "Bangkok": "曼谷", "Kuala Lumpur": "吉隆坡",
  "London": "伦敦", "Paris": "巴黎", "Berlin": "柏林", "Moscow": "莫斯科",
  "New York": "纽约", "Los Angeles": "洛杉矶", "Chicago": "芝加哥",
  "Toronto": "多伦多", "Sydney": "悉尼", "Melbourne": "墨尔本"
  // ... 可以添加更多城市
};

function extractChineseName(text) {
  if (!text) return null;
  const noisePatterns = [
    /感谢.*?使用/gi, /如果.*?问题/gi, /请.*?反馈/gi,
    /^翻译[:：]/gi, /^结果[:：]/gi, /[\[\]【】]/g, /\n/g
  ];
  let cleaned = text.trim();
  for (const pattern of noisePatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  const chineseMatch = cleaned.match(/[\u4e00-\u9fa5]+/g);
  if (!chineseMatch || chineseMatch.length === 0) return null;
  const validSegments = chineseMatch.filter(seg => seg.length >= 2 && seg.length <= 20);
  if (validSegments.length > 0) {
    return validSegments.reduce((a, b) => a.length > b.length ? a : b).trim();
  }
  return null;
}

async function translateToChineseOnline(text, countryCode) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed || /[\u4e00-\u9fa5]/.test(trimmed)) return trimmed;
  
  const countryContexts = {
    'KR': ', South Korea', 'JP': ', Japan', 'CN': ', China',
    'TW': ', Taiwan', 'IN': ', India', 'VN': ', Vietnam'
  };
  const countryContext = countryContexts[countryCode] || '';
  
  // 维基百科API
  const wikiSearchTerms = [
    trimmed + countryContext,
    trimmed.replace(/-si$/, '') + countryContext,
    trimmed
  ];
  
  for (const searchTerm of wikiSearchTerms) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=langlinks&titles=${encodeURIComponent(searchTerm)}&lllang=zh&redirects=1&origin=*`;
      const wikiRes = await fetch(wikiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData?.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1') {
            const langlinks = pages[pageId]?.langlinks;
            if (langlinks && langlinks.length > 0) {
              let zhTitle = langlinks[0]['*'];
              if (zhTitle && /[\u4e00-\u9fa5]/.test(zhTitle)) {
                zhTitle = zhTitle.replace(/[（(].*?[）)]/g, '').trim();
                if (countryCode === 'KR' && trimmed.toLowerCase().includes('anyang')) {
                  zhTitle = zhTitle.replace(/安阳/g, '安养');
                }
                return zhTitle;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(`Wikipedia search failed: ${e.message}`);
    }
  }
  
  // Google Translate
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translation = extractChineseName(data[0][0][0]);
        if (translation && translation.length >= 2) {
          return translation;
        }
      }
    }
  } catch (e) {
    console.log(`Google Translate failed: ${e.message}`);
  }
  
  return null;
}

function getClientIP(request, url) {
  const ipParam = url.searchParams.get("ip");
  if (ipParam && /^(\d{1,3}\.){3}\d{1,3}$/.test(ipParam)) return ipParam;
  
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "1.1.1.1"
  );
}

async function getGeo(ip) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,isp,org,as,hosting,query`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return data;
      }
    }
  } catch (e) {
    console.log(`ip-api.com failed: ${e.message}`);
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        return {
          country: data.country_name || data.country,
          countryCode: data.country_code || data.country,
          city: data.city,
          regionName: data.region,
          isp: data.org || data.asn,
          org: data.org,
          hosting: false
        };
      }
    }
  } catch (e) {
    console.log(`ipapi.co failed: ${e.message}`);
  }
  
  return null;
}

function generateHTML(countryCN, cityCN, ip, networkType, isp) {
  const flagEmoji = countryCN.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu)?.[0] || '🌍';
  const countryName = countryCN.replace(/[\u{1F1E6}-\u{1F1FF}]{2}\s*/gu, '').trim();
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IP 地理位置 - ${countryName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 20px;
    }
    .container {
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 50px 60px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 500px;
      width: 100%;
    }
    .flag {
      font-size: 100px;
      line-height: 1;
      margin-bottom: 30px;
      font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji';
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
    .info-line {
      font-size: 20px;
      font-weight: 600;
      margin: 20px 0;
      padding: 15px 20px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      letter-spacing: 0.5px;
      line-height: 1.6;
    }
    .info-line .label {
      font-size: 14px;
      opacity: 0.8;
      display: block;
      margin-bottom: 5px;
      font-weight: 400;
    }
    .info-line .value {
      font-family: 'Courier New', monospace;
      font-weight: 700;
    }
    .network-badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      font-size: 14px;
      margin-left: 10px;
      font-weight: 500;
    }
    .network-badge.hosting { background: rgba(255, 193, 7, 0.3); }
    .network-badge.isp { background: rgba(76, 175, 80, 0.3); }
    .tip {
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 14px;
      opacity: 0.8;
    }
    @media (max-width: 600px) {
      .container { padding: 35px 30px; }
      .flag { font-size: 70px; }
      .info-line { font-size: 18px; padding: 12px 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="flag">${flagEmoji}</div>
    <div class="info-line">
      <span class="label">IP 地址</span>
      <span class="value">${ip}</span>
    </div>
    <div class="info-line">
      <span class="label">网络类型</span>
      <span class="value">${networkType}</span>
      <span class="network-badge ${networkType === 'Hosting' ? 'hosting' : 'isp'}">
        ${networkType === 'Hosting' ? '🖥️ 数据中心' : '🏠 家庭/企业网络'}
      </span>
    </div>
    <div class="info-line">
      <span class="label">国家 / 地区</span>
      <span class="value">${countryName}${cityCN ? ' · ' + cityCN : ''}</span>
    </div>
    ${isp ? `<div class="info-line">
      <span class="label">网络运营商</span>
      <span class="value" style="font-size: 16px;">${isp}</span>
    </div>` : ''}
    <div class="tip">
      💡 API示例: https://你的域名.netlify.app/ip-geo?ip=1.1.1.1
    </div>
  </div>
</body>
</html>`;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const ip = getClientIP(request, url);
  const geo = await getGeo(ip);
  
  let countryCode = geo?.countryCode || geo?.country_code || context.geo?.country?.code;
  let countryCN = COUNTRY_MAP[countryCode];
  
  if (!countryCN) {
    const countryEN = geo?.country || geo?.country_name || context.geo?.country?.name;
    if (countryEN) {
      if (/[\u4e00-\u9fa5]/.test(countryEN)) {
        countryCN = countryEN;
      } else {
        const translated = await translateToChineseOnline(countryEN);
        countryCN = translated || countryEN;
      }
    } else {
      countryCN = "未知国家";
    }
    if (!/[\u{1F1E6}-\u{1F1FF}]/u.test(countryCN)) {
      countryCN = "🌍 " + countryCN;
    }
  }
  
  let city = geo?.city || geo?.regionName || context.geo?.city;
  let cityCN = "";
  
  if (city) {
    cityCN = CITY_MAP[city] || CITY_MAP[city.trim().replace(/\s+/g, ' ')];
    if (!cityCN) {
      if (/[\u4e00-\u9fa5]/.test(city)) {
        cityCN = city;
      } else {
        const translated = await translateToChineseOnline(city, countryCode);
        cityCN = translated || city;
      }
    }
  }
  
  const accept = request.headers.get("Accept") || "";
  const userAgent = request.headers.get("User-Agent") || "";
  const isBrowser = accept.includes("text/html") && !userAgent.match(/curl|wget|httpie|python|java|go-http/i);
  const isHosting = geo?.hosting === true || geo?.hosting === "true";
  const networkType = isHosting ? "Hosting" : "ISP";
  const isp = geo?.isp || geo?.org || geo?.as || "";
  
  if (isBrowser) {
    return new Response(generateHTML(countryCN, cityCN, ip, networkType, isp), {
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Cache-Control": "public, max-age=1800"
      }
    });
  } else {
    const result = `${countryCN}${cityCN ? " " + cityCN : ""}`;
    return new Response(result, {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=1800",
        "X-IP": ip,
        "X-Country-Code": countryCode || ""
      }
    });
  }
};
