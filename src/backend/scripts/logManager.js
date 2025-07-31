const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Available log types
const LOG_TYPES = {
  'general': 'General application logs',
  'payments': 'Payment-related activities',
  'auth': 'User authentication (login, signup, logout)',
  'orders': 'Order creation, updates, and retrieval',
  'products': 'Product management activities',
  'errors': 'Application errors and exceptions',
  'security': 'Security events and failed attempts',
  'api': 'API requests and responses'
};

// Function to list all log files with descriptions
function listLogFiles() {
  if (!fs.existsSync(logsDir)) {
    console.log('No logs directory found.');
    return;
  }

  const files = fs.readdirSync(logsDir);
  console.log('\n📁 Log Files:');
  console.log('─'.repeat(80));
  
  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    const logType = file.replace('.log', '');
    const description = LOG_TYPES[logType] || 'Unknown log type';
    
    console.log(`  📄 ${file.padEnd(20)} (${sizeInMB.padStart(6)} MB) - ${description}`);
  });
  
  console.log('─'.repeat(80));
  console.log(`Total files: ${files.length}`);
}

// Function to clean old log files
function cleanOldLogs(daysToKeep = 30) {
  if (!fs.existsSync(logsDir)) {
    console.log('No logs directory found.');
    return;
  }

  const files = fs.readdirSync(logsDir);
  const now = Date.now();
  const cutoff = now - (daysToKeep * 24 * 60 * 60 * 1000);

  let deletedCount = 0;
  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.mtime.getTime() < cutoff) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted old log: ${file}`);
      deletedCount++;
    }
  });

  console.log(`\n✅ Cleaned ${deletedCount} old log files.`);
}

// Function to show log statistics
function showLogStats() {
  if (!fs.existsSync(logsDir)) {
    console.log('No logs directory found.');
    return;
  }

  const files = fs.readdirSync(logsDir);
  let totalSize = 0;
  let fileCount = 0;
  const statsByType = {};

  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / 1024 / 1024;
    const logType = file.replace('.log', '');
    
    totalSize += stats.size;
    fileCount++;
    
    if (!statsByType[logType]) {
      statsByType[logType] = { count: 0, size: 0 };
    }
    statsByType[logType].count++;
    statsByType[logType].size += sizeInMB;
  });

  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`\n📊 Log Statistics:`);
  console.log('─'.repeat(80));
  console.log(`  📁 Total files: ${fileCount}`);
  console.log(`  💾 Total size: ${totalSizeMB} MB`);
  console.log('\n📋 Breakdown by type:');
  
  Object.keys(statsByType).forEach(type => {
    const { count, size } = statsByType[type];
    const description = LOG_TYPES[type] || 'Unknown';
    console.log(`  ${type.padEnd(12)} ${count.toString().padStart(2)} files, ${size.toFixed(2).padStart(6)} MB - ${description}`);
  });
  console.log('─'.repeat(80));
}

// Function to view recent logs
function viewRecentLogs(logType = 'general', lines = 50) {
  const logFile = path.join(logsDir, `${logType}.log`);
  
  if (!fs.existsSync(logFile)) {
    console.log(`❌ Log file not found: ${logType}.log`);
    console.log('\nAvailable log types:');
    Object.keys(LOG_TYPES).forEach(type => {
      console.log(`  - ${type}: ${LOG_TYPES[type]}`);
    });
    return;
  }

  const content = fs.readFileSync(logFile, 'utf8');
  const linesArray = content.split('\n').filter(line => line.trim());
  const recentLines = linesArray.slice(-lines);

  console.log(`\n📋 Recent ${logType} logs (last ${lines} lines):`);
  console.log(`📄 File: ${logType}.log`);
  console.log(`📝 Description: ${LOG_TYPES[logType] || 'Unknown log type'}`);
  console.log('─'.repeat(80));
  
  if (recentLines.length === 0) {
    console.log('No logs found in this file.');
  } else {
    recentLines.forEach(line => {
      try {
        // Try to parse JSON and format it nicely
        const logEntry = JSON.parse(line);
        const timestamp = new Date(logEntry.timestamp).toLocaleString();
        const level = logEntry.level.toUpperCase();
        const message = logEntry.message;
        const meta = { ...logEntry };
        delete meta.timestamp;
        delete meta.level;
        delete meta.message;
        delete meta.service;
        delete meta.logType;
        
        console.log(`[${timestamp}] [${level}] ${message}`);
        if (Object.keys(meta).length > 0) {
          console.log(`  📋 Meta: ${JSON.stringify(meta, null, 2)}`);
        }
        console.log('');
      } catch (e) {
        // If not JSON, just print the line
        console.log(line);
      }
    });
  }
  console.log('─'.repeat(80));
}

// Function to search logs
function searchLogs(logType, searchTerm) {
  const logFile = path.join(logsDir, `${logType}.log`);
  
  if (!fs.existsSync(logFile)) {
    console.log(`❌ Log file not found: ${logType}.log`);
    return;
  }

  const content = fs.readFileSync(logFile, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  const matchingLines = lines.filter(line => 
    line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(`\n🔍 Search results for "${searchTerm}" in ${logType}.log:`);
  console.log(`📄 Found ${matchingLines.length} matching entries`);
  console.log('─'.repeat(80));
  
  matchingLines.forEach(line => {
    try {
      const logEntry = JSON.parse(line);
      const timestamp = new Date(logEntry.timestamp).toLocaleString();
      const level = logEntry.level.toUpperCase();
      const message = logEntry.message;
      
      console.log(`[${timestamp}] [${level}] ${message}`);
    } catch (e) {
      console.log(line);
    }
  });
  console.log('─'.repeat(80));
}

// Main function
function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  const arg2 = process.argv[4];

  switch (command) {
    case 'list':
      listLogFiles();
      break;
    case 'clean':
      const days = parseInt(arg) || 30;
      cleanOldLogs(days);
      break;
    case 'stats':
      showLogStats();
      break;
    case 'view':
      const logType = arg || 'general';
      const lines = parseInt(arg2) || 50;
      viewRecentLogs(logType, lines);
      break;
    case 'search':
      const searchLogType = arg || 'general';
      const searchTerm = arg2;
      if (!searchTerm) {
        console.log('❌ Please provide a search term: node logManager.js search [logType] [searchTerm]');
        return;
      }
      searchLogs(searchLogType, searchTerm);
      break;
    default:
      console.log(`
🔧 Log Manager - Usage:
  node logManager.js list                                    - List all log files with descriptions
  node logManager.js clean [days]                           - Clean logs older than days (default: 30)
  node logManager.js stats                                   - Show detailed log statistics
  node logManager.js view [type] [lines]                    - View recent logs (default: general, 50 lines)
  node logManager.js search [type] [searchTerm]             - Search logs for specific terms
  
Available log types:
${Object.keys(LOG_TYPES).map(type => `  - ${type.padEnd(12)} ${LOG_TYPES[type]}`).join('\n')}

Examples:
  node logManager.js view payments 20                       - View last 20 payment logs
  node logManager.js search auth "login failed"             - Search auth logs for failed logins
  node logManager.js view errors                             - View recent error logs
      `);
  }
}

if (require.main === module) {
  main();
}

module.exports = { listLogFiles, cleanOldLogs, showLogStats, viewRecentLogs, searchLogs }; 