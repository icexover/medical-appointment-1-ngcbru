import type { Department, Doctor, DoctorTitle } from '@/types'

export const departments: Department[] = [
  { id: 'dept-01', name: '心血管内科', icon: '❤️', description: '心脏及血管系统疾病的诊疗', doctorCount: 12, floor: '门诊楼3层' },
  { id: 'dept-02', name: '普外科', icon: '🩺', description: '胃肠、肝胆、甲状腺等外科疾病', doctorCount: 15, floor: '门诊楼4层' },
  { id: 'dept-03', name: '儿科', icon: '👶', description: '儿童常见病、新生儿疾病', doctorCount: 18, floor: '门诊楼2层' },
  { id: 'dept-04', name: '妇产科', icon: '🤰', description: '妇科疾病、产科保健', doctorCount: 10, floor: '门诊楼5层' },
  { id: 'dept-05', name: '神经内科', icon: '🧠', description: '神经系统疾病诊疗', doctorCount: 8, floor: '门诊楼3层' },
  { id: 'dept-06', name: '骨科', icon: '🦴', description: '骨骼关节、运动损伤', doctorCount: 14, floor: '门诊楼6层' },
  { id: 'dept-07', name: '皮肤科', icon: '🧴', description: '皮肤疾病、美容皮肤科', doctorCount: 6, floor: '门诊楼2层' },
  { id: 'dept-08', name: '眼科', icon: '👁️', description: '眼部疾病、视力矫正', doctorCount: 9, floor: '门诊楼4层' },
  { id: 'dept-09', name: '耳鼻喉科', icon: '👂', description: '耳鼻咽喉疾病', doctorCount: 7, floor: '门诊楼5层' },
  { id: 'dept-10', name: '口腔科', icon: '🦷', description: '口腔疾病、牙齿矫正', doctorCount: 11, floor: '门诊楼6层' },
  { id: 'dept-11', name: '呼吸内科', icon: '🫁', description: '肺部、气管疾病', doctorCount: 10, floor: '门诊楼3层' },
  { id: 'dept-12', name: '消化内科', icon: '🍜', description: '胃肠、肝胆胰内科治疗', doctorCount: 9, floor: '门诊楼3层' },
]

export const doctors: Doctor[] = [
  { id: 'doc-101', name: '王建国', title: '主任医师', departmentId: 'dept-01', departmentName: '心血管内科',
    avatar: '', specialty: '冠心病、高血压、心律失常、心力衰竭', score: 4.9, reviewCount: 1256, price: 100,
    bio: '从事心血管内科临床工作30年，擅长冠心病介入治疗、高血压诊治、心律失常射频消融等，发表SCI论文20余篇。' },
  { id: 'doc-102', name: '刘芳', title: '副主任医师', departmentId: 'dept-01', departmentName: '心血管内科',
    avatar: '', specialty: '冠心病、心肌病、心功能不全', score: 4.8, reviewCount: 856, price: 80,
    bio: '副主任医师，医学博士，擅长冠心病、心肌病的诊断与治疗，尤其在心力衰竭管理方面有丰富经验。' },
  { id: 'doc-103', name: '陈志强', title: '主治医师', departmentId: 'dept-01', departmentName: '心血管内科',
    avatar: '', specialty: '高血压、高血脂、冠心病预防', score: 4.7, reviewCount: 423, price: 60,
    bio: '主治医师，医学硕士，擅长心血管疾病的预防与诊治，关注患者健康教育。' },
  { id: 'doc-201', name: '李秀英', title: '副主任医师', departmentId: 'dept-02', departmentName: '普外科',
    avatar: '', specialty: '胃肠外科、腹腔镜手术', score: 4.8, reviewCount: 932, price: 80,
    bio: '普外科副主任医师，擅长胃肠道肿瘤微创手术治疗，腹腔镜技术精湛。' },
  { id: 'doc-202', name: '张伟', title: '主任医师', departmentId: 'dept-02', departmentName: '普外科',
    avatar: '', specialty: '肝胆外科、甲状腺手术', score: 4.9, reviewCount: 1102, price: 100,
    bio: '普外科主任医师，医学博士，擅长肝胆胰脾疾病的外科治疗。' },
  { id: 'doc-203', name: '王晓东', title: '主治医师', departmentId: 'dept-02', departmentName: '普外科',
    avatar: '', specialty: '疝气、阑尾炎、肛肠科疾病', score: 4.6, reviewCount: 312, price: 60,
    bio: '普外科主治医师，擅长常见普外科疾病的诊断与治疗。' },
  { id: 'doc-301', name: '张明华', title: '主治医师', departmentId: 'dept-03', departmentName: '儿科',
    avatar: '', specialty: '小儿呼吸系统疾病、新生儿疾病', score: 4.8, reviewCount: 1520, price: 60,
    bio: '儿科主治医师，擅长小儿内科常见疾病诊疗，对待患儿耐心细致。' },
  { id: 'doc-302', name: '赵丽', title: '副主任医师', departmentId: 'dept-03', departmentName: '儿科',
    avatar: '', specialty: '小儿消化、儿童保健', score: 4.9, reviewCount: 1860, price: 80,
    bio: '儿科副主任医师，儿童保健专家，擅长儿童生长发育评估。' },
  { id: 'doc-303', name: '孙建国', title: '主任医师', departmentId: 'dept-03', departmentName: '儿科',
    avatar: '', specialty: '小儿心血管、先天性心脏病', score: 4.9, reviewCount: 980, price: 100,
    bio: '儿科主任医师，小儿心血管专家，先天性心脏病介入治疗专家。' },
  { id: 'doc-401', name: '周美玲', title: '主任医师', departmentId: 'dept-04', departmentName: '妇产科',
    avatar: '', specialty: '妇科肿瘤、微创手术', score: 4.9, reviewCount: 1045, price: 100,
    bio: '妇产科主任医师，妇科肿瘤专家，擅长腹腔镜下妇科恶性肿瘤手术。' },
  { id: 'doc-402', name: '吴雪梅', title: '副主任医师', departmentId: 'dept-04', departmentName: '妇产科',
    avatar: '', specialty: '产科高危妊娠、产前诊断', score: 4.8, reviewCount: 1120, price: 80,
    bio: '妇产科副主任医师，高危妊娠管理经验丰富。' },
  { id: 'doc-501', name: '郑文博', title: '主任医师', departmentId: 'dept-05', departmentName: '神经内科',
    avatar: '', specialty: '脑血管病、帕金森病、癫痫', score: 4.9, reviewCount: 876, price: 100,
    bio: '神经内科主任医师，脑血管病专家，脑卒中绿色通道负责人。' },
  { id: 'doc-502', name: '林小燕', title: '副主任医师', departmentId: 'dept-05', departmentName: '神经内科',
    avatar: '', specialty: '头痛、眩晕、失眠', score: 4.7, reviewCount: 543, price: 80,
    bio: '神经内科副主任医师，擅长头痛眩晕的诊断治疗。' },
  { id: 'doc-601', name: '黄志强', title: '主任医师', departmentId: 'dept-06', departmentName: '骨科',
    avatar: '', specialty: '关节置换、运动损伤', score: 4.9, reviewCount: 1320, price: 100,
    bio: '骨科主任医师，关节外科专家，人工关节置换手术经验丰富。' },
  { id: 'doc-602', name: '何光明', title: '副主任医师', departmentId: 'dept-06', departmentName: '骨科',
    avatar: '', specialty: '脊柱外科、腰椎间盘突出', score: 4.8, reviewCount: 765, price: 80,
    bio: '骨科副主任医师，脊柱外科专家。' },
]

export function getDoctorsByDepartment(departmentId: string): Doctor[] {
  return doctors.filter(d => d.departmentId === departmentId)
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find(d => d.id === id)
}

export function getDepartmentById(id: string): Department | undefined {
  return departments.find(d => d.id === id)
}

export function searchDoctors(keyword: string): Doctor[] {
  const kw = keyword.toLowerCase()
  return doctors.filter(
    d => d.name.toLowerCase().includes(kw) ||
      d.specialty.toLowerCase().includes(kw) ||
      d.departmentName.includes(keyword)
  )
}

export function searchDepartments(keyword: string): Department[] {
  return departments.filter(d => d.name.includes(keyword) || d.description.includes(keyword))
}
