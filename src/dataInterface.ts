export interface IDataInterviews {
 id: string
 candidate: string
 position: string
 descrPosition: string
 phoneCandidate?: string
 whatsappCandidate?: string
 telegramCandidate?: string
 createdAt: Date
 salaryFrom?: number
 salaryTo?: number
 stages?: IDataStage[]
 result: 'Offer' | 'Refusal'
}

export interface IDataStage {
  nameStage: string
  dateStage: string
  comments: string
}