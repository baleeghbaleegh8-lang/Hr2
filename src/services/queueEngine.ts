export type ProjectState = 
  | 'Draft'
  | 'Analyzing'
  | 'Designing'
  | 'Generating'
  | 'Validating'
  | 'Review Required'
  | 'Approved'
  | 'Exported'
  | 'Archived';

export interface BackgroundJob {
  jobId: string;
  projectName: string;
  taskType: 'توليد كامل' | 'تحديث جزئي' | 'فحص جودة' | 'تصدير حزمة ZIP';
  progressPercentage: number; // 0 - 100
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  currentState: ProjectState;
  startTime: string;
  message: string;
}

class QueueEngineService {
  private jobs: BackgroundJob[] = [
    {
      jobId: 'JOB-9041',
      projectName: 'المجموعة المؤسسية القابضة',
      taskType: 'توليد كامل',
      progressPercentage: 100,
      status: 'COMPLETED',
      currentState: 'Approved',
      startTime: new Date(Date.now() - 600000).toISOString(),
      message: 'تم إكمال التوليد وتنسيق الجداول والصيغ بنجاح'
    }
  ];

  public getJobs(): BackgroundJob[] {
    return this.jobs;
  }

  public createJob(projectName: string, taskType: BackgroundJob['taskType']): BackgroundJob {
    const job: BackgroundJob = {
      jobId: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      projectName,
      taskType,
      progressPercentage: 10,
      status: 'RUNNING',
      currentState: 'Analyzing',
      startTime: new Date().toISOString(),
      message: 'جاري تحليل المتطلبات والـ JSON Schema...'
    };
    this.jobs.unshift(job);
    return job;
  }

  public updateProgress(jobId: string, progress: number, state: ProjectState, message: string) {
    const job = this.jobs.find(j => j.jobId === jobId);
    if (job) {
      job.progressPercentage = Math.min(100, progress);
      job.currentState = state;
      job.message = message;
      if (progress >= 100) {
        job.status = 'COMPLETED';
      }
    }
  }
}

export const queueEngine = new QueueEngineService();
