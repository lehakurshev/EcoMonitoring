type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
}

class Logger {
    private logs: LogEntry[] = [];
    private maxLogs = 1000;

    private formatTimestamp(): string {
        const now = new Date();
        return now.toISOString();
    }

    private createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
        return {
            timestamp: this.formatTimestamp(),
            level,
            message,
            data
        };
    }

    private addLog(entry: LogEntry): void {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        this.saveToLocalStorage();
        this.appendToFile(entry);
    }

    private saveToLocalStorage(): void {
        try {
            const recentLogs = this.logs.slice(-100);
            localStorage.setItem('app_logs', JSON.stringify(recentLogs));
        } catch (error) {
        }
    }

    private appendToFile(entry: LogEntry): void {
        try {
            const logLine = `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}${entry.data ? ' ' + JSON.stringify(entry.data) : ''}\n`;
            
            const existingLogs = localStorage.getItem('app_logs_file') || '';
            const updatedLogs = existingLogs + logLine;
            
            const maxFileSize = 500000;
            if (updatedLogs.length > maxFileSize) {
                const lines = updatedLogs.split('\n');
                const trimmedLogs = lines.slice(-5000).join('\n');
                localStorage.setItem('app_logs_file', trimmedLogs);
            } else {
                localStorage.setItem('app_logs_file', updatedLogs);
            }
        } catch (error) {
        }
    }

    info(message: string, data?: unknown): void {
        const entry = this.createLogEntry('info', message, data);
        this.addLog(entry);
    }

    warn(message: string, data?: unknown): void {
        const entry = this.createLogEntry('warn', message, data);
        this.addLog(entry);
    }

    error(message: string, error?: unknown): void {
        const entry = this.createLogEntry('error', message, error);
        this.addLog(entry);
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
        localStorage.removeItem('app_logs');
        localStorage.removeItem('app_logs_file');
    }

    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    exportLogsAsText(): string {
        return localStorage.getItem('app_logs_file') || '';
    }

    downloadLogs(): void {
        const logsText = this.exportLogsAsText();
        const blob = new Blob([logsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadLogsAsJson(): void {
        const logsText = this.exportLogs();
        const blob = new Blob([logsText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export const logger = new Logger();
