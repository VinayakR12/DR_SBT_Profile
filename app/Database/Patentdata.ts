export type Patent = {
  id: number
  type: 'Utility' | 'Design' | 'Provisional'
  title: string
  description: string
  applicationNo: string
  referenceNo?: string
  docketNo?: string
  crcNo?: string
  filingDate: string
  publicationDate?: string
  status: 'Published' | 'Granted' | 'Pending'
  tags: string[]
  file?: string
}

export type Copyright = {
  id: number
  title: string
  category: string
  diaryNo: string
  date: string
  published: boolean
  description?: string
  file?: string
}

export const PATENTS: Patent[] = [
  {
    id: 1,
    type: 'Utility',
    title: 'AI-Based System for Crop and Weed Classification in Precision Agriculture',
    description: 'A Convolutional Neural Network (CNN) based system that automatically identifies and classifies crop species and weeds from field imagery, enabling targeted herbicide application and reducing chemical overuse in farming.',
    applicationNo: '202421045939',
    referenceNo: '417/MUM/2024',
    docketNo: 'TMP-001-2024',
    filingDate: '20 June 2024',
    publicationDate: '12 July 2024',
    status: 'Published',
    tags: ['Artificial Intelligence', 'CNN', 'Precision Agriculture', 'Weed Detection'],
    file: '/patents/crop-weed-classification.pdf',
  },
  {
    id: 2,
    type: 'Utility',
    title: 'YOLO-Based Density Estimation System for Agricultural Field Analysis',
    description: 'A real-time object detection system using YOLO architecture that estimates crop and weed density across agricultural fields, providing actionable insights for precision farming and resource optimization.',
    applicationNo: '202521001234',
    referenceNo: '456/MUM/2025',
    docketNo: 'TMP-002-2025',
    filingDate: '15 January 2025',
    status: 'Pending',
    tags: ['YOLO', 'Object Detection', 'Density Estimation', 'Smart Farming'],
    file: '/patents/yolo-density-estimation.pdf',
  },
]

export const COPYRIGHTS: Copyright[] = [
  {
    id: 1,
    title: 'AgriVision AI — Crop and Weed Detection Software',
    category: 'Computer Software',
    diaryNo: '14704/2024-CO/SW',
    date: '15 August 2024',
    published: true,
    description: 'Deep learning-based software for real-time crop and weed classification from agricultural imagery using CNN architecture.',
    file: '/copyrights/agrivision-ai.pdf',
  },
  {
    id: 2,
    title: 'MetaCampus Virtual Classroom Platform',
    category: 'Educational Software',
    diaryNo: '15892/2024-CO/SW',
    date: '20 September 2024',
    published: true,
    description: 'Virtual reality-based online education platform with interactive 3D classrooms and real-time collaboration features.',
    file: '/copyrights/metacampus.pdf',
  },
]

export const PATENT_STATS = {
  totalPatents: PATENTS.length,
  totalCopyrights: COPYRIGHTS.length,
  publishedPatents: PATENTS.filter(p => p.status === 'Published').length,
}

export const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Published: { 
    bg: 'rgba(26,107,72,0.08)', 
    border: 'rgba(26,107,72,0.22)', 
    text: '#1A6B48', 
    dot: '#1A6B48' 
  },
  Granted: { 
    bg: 'rgba(184,135,10,0.10)', 
    border: 'rgba(184,135,10,0.26)', 
    text: '#7A5500', 
    dot: '#B8870A' 
  },
  Pending: { 
    bg: 'rgba(45,91,138,0.08)', 
    border: 'rgba(45,91,138,0.22)', 
    text: '#2D5B8A', 
    dot: '#4A7AB8' 
  },
}