export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  action: string;
  objectType: string;
  objectId: string;
  previousValue?: string;
  newValue?: string;
}

class AuditEngineService {
  private logs: AuditLogEntry[] = [
    {
      id: 'AUD-0001',
      userId: 'USR-000001',
      userName: 'مدير النظام (مؤسسي)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ipAddress: '192.168.1.100',
      action: 'إنشاء مشروع جديد',
      objectType: 'مشروع مؤسسي',
      objectId: 'PRJ-000001',
      newValue: 'المجموعة المؤسسية القابضة'
    },
    {
      id: 'AUD-0002',
      userId: 'USR-000001',
      userName: 'مدير النظام (مؤسسي)',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      ipAddress: '192.168.1.100',
      action: 'تصدير حزمة ZIP كاملة',
      objectType: 'حزمة تصدير',
      objectId: 'ZIP-HR-V1.0',
      newValue: 'تنزيل 12 مجلداً مؤسسياً'
    }
  ];

  public logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${String(this.logs.length + 1).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100'
    };
    this.logs.unshift(newEntry);
  }

  public getLogs(): AuditLogEntry[] {
    return this.logs;
  }
}

export const auditEngine = new AuditEngineService();
