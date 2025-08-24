import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await hash('FreeUnApp@2025', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@freeunapp.org' },
    update: {},
    create: {
      email: 'admin@freeunapp.org',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      approved: true,
      profileComplete: true,
    },
  })

  // Create sample student user
  const studentPassword = await hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'John Doe',
      password: studentPassword,
      role: 'STUDENT',
      approved: true,
      profileComplete: true,
    },
  })

  // Sample scholarships data
  const scholarships = [
    {
      title: "Google Generation Scholarship",
      description: "Full scholarship for underrepresented groups in computer science",
      detailedDescription: "The Google Generation Scholarship program provides full tuition coverage for students from underrepresented backgrounds pursuing degrees in computer science. This prestigious scholarship includes mentorship opportunities, internship possibilities, and networking events with Google professionals.",
      logoUrl: "https://via.placeholder.com/150x150/4285F4/FFFFFF?text=G",
      referenceUrl: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship/",
      eligibilityCriteria: "Must be from an underrepresented group in computer science, enrolled in a 4-year university, maintaining a 3.0+ GPA",
      applicationProcess: "Online application with essays, transcripts, and letters of recommendation",
      qualificationBasis: "Academic excellence, leadership potential, and commitment to diversity in tech",
      awardsAvailable: 50,
      amount: "Full tuition + $10,000",
      amountType: "FULL" as const,
      categories: ["COMPUTER_SCIENCE", "SOFTWARE_ENGINEERING", "INFORMATION_TECHNOLOGY"],
      degreeLevels: ["BACHELOR", "MASTER"],
      deadline: new Date('2024-12-15'),
      contactInfo: "generation-google@google.com",
      adminId: admin.id,
    },
    {
      title: "Chevening Scholarship",
      description: "UK government scholarship for international students",
      detailedDescription: "The Chevening Scholarship is the UK government's international awards scheme aimed at developing global leaders. Funded by the Foreign and Commonwealth Office (FCO) and partner organizations, Chevening offers two types of award - Chevening Scholarships and Chevening Fellowships.",
      logoUrl: "https://via.placeholder.com/150x150/012169/FFFFFF?text=C",
      referenceUrl: "https://www.chevening.org/",
      eligibilityCriteria: "Citizen of a Chevening-eligible country, completed undergraduate degree, 2+ years work experience",
      applicationProcess: "Online application with essays, references, and interview",
      qualificationBasis: "Leadership potential, academic excellence, and career goals",
      awardsAvailable: 1500,
      amount: "Full tuition + living expenses",
      amountType: "FULL",
      categories: ["BUSINESS", "ECONOMICS", "INTERNATIONAL_RELATIONS", "POLITICAL_SCIENCE"],
      degreeLevels: ["MASTER", "PHD"],
      deadline: new Date('2024-11-01'),
      contactInfo: "info@chevening.org",
      adminId: admin.id,
    },
    {
      title: "Fulbright Program",
      description: "US government international exchange program",
      detailedDescription: "The Fulbright Program is one of several United States Cultural Exchange Programs with the goal of improving intercultural relations, cultural diplomacy, and intercultural competence between the people of the United States and other countries through the exchange of persons, knowledge, and skills.",
      logoUrl: "https://via.placeholder.com/150x150/002868/FFFFFF?text=F",
      referenceUrl: "https://fulbright.state.gov/",
      eligibilityCriteria: "US citizen, bachelor's degree, proficiency in host country language",
      applicationProcess: "Online application with project proposal, references, and interview",
      qualificationBasis: "Academic merit, leadership potential, and cultural exchange goals",
      awardsAvailable: 8000,
      amount: "Full funding + stipend",
      amountType: "FULL",
      categories: ["EDUCATION", "LANGUAGES", "COMMUNICATION", "JOURNALISM"],
      degreeLevels: ["MASTER", "PHD"],
      deadline: new Date('2024-10-15'),
      contactInfo: "fulbright@state.gov",
      adminId: admin.id,
    },
    {
      title: "MIT Presidential Fellowship",
      description: "Merit-based fellowship for MIT graduate students",
      detailedDescription: "The MIT Presidential Fellowship is awarded to incoming graduate students who demonstrate exceptional academic achievement and research potential. This prestigious fellowship provides full tuition coverage and a generous stipend for living expenses.",
      logoUrl: "https://via.placeholder.com/150x150/8A8B8C/FFFFFF?text=MIT",
      referenceUrl: "https://gradadmissions.mit.edu/financing/fellowships",
      eligibilityCriteria: "Admitted to MIT graduate program, exceptional academic record, research potential",
      applicationProcess: "Automatic consideration with graduate application",
      qualificationBasis: "Academic excellence and research potential",
      awardsAvailable: 100,
      amount: "Full tuition + $45,000 stipend",
      amountType: "FULL",
      categories: ["ELECTRICAL_ENGINEERING", "MECHANICAL_ENGINEERING", "CIVIL_ENGINEERING", "CHEMICAL_ENGINEERING"],
      degreeLevels: ["PHD"],
      deadline: new Date('2024-12-01'),
      contactInfo: "gradadmissions@mit.edu",
      adminId: admin.id,
    },
    {
      title: "Rhodes Scholarship",
      description: "Oldest international scholarship program",
      detailedDescription: "The Rhodes Scholarship is the oldest and perhaps most prestigious international scholarship program, enabling outstanding young people from around the world to study at the University of Oxford. Rhodes Scholars are chosen not only for their outstanding scholarly achievements, but for their character, commitment to others and to the common good, and for their potential for leadership.",
      logoUrl: "https://via.placeholder.com/150x150/1F4E79/FFFFFF?text=R",
      referenceUrl: "https://www.rhodeshouse.ox.ac.uk/",
      eligibilityCriteria: "Age 18-23, exceptional academic achievement, leadership potential",
      applicationProcess: "National selection process with interviews and essays",
      qualificationBasis: "Academic excellence, leadership, and character",
      awardsAvailable: 100,
      amount: "Full tuition + living expenses",
      amountType: "FULL",
      categories: ["LAW", "POLITICAL_SCIENCE", "INTERNATIONAL_RELATIONS", "ECONOMICS"],
      degreeLevels: ["MASTER", "PHD"],
      deadline: new Date('2024-10-01'),
      contactInfo: "rhodes@ox.ac.uk",
      adminId: admin.id,
    },
    {
      title: "Stanford Knight-Hennessy Scholars",
      description: "Graduate scholarship program at Stanford University",
      detailedDescription: "The Knight-Hennessy Scholars program cultivates and supports a highly-engaged, multidisciplinary and multicultural community of graduate students from across Stanford University, and delivers a diverse collection of educational experiences, preparing the next generation of global leaders.",
      logoUrl: "https://via.placeholder.com/150x150/8C1515/FFFFFF?text=S",
      referenceUrl: "https://knight-hennessy.stanford.edu/",
      eligibilityCriteria: "Applying to Stanford graduate program, leadership potential, independence of thought",
      applicationProcess: "Separate application with essays, recommendations, and interviews",
      qualificationBasis: "Leadership potential, independence of thought, and purposeful leadership",
      awardsAvailable: 100,
      amount: "Full funding for up to 3 years",
      amountType: "FULL",
      categories: ["BUSINESS_ADMINISTRATION", "PSYCHOLOGY", "SOCIOLOGY", "EDUCATION"],
      degreeLevels: ["PHD"],
      deadline: new Date('2024-10-12'),
      contactInfo: "knight-hennessy@stanford.edu",
      adminId: admin.id,
    },
    {
      title: "Microsoft Research PhD Fellowship",
      description: "Research fellowship for PhD students in computer science",
      detailedDescription: "The Microsoft Research PhD Fellowship is a global program that identifies and empowers the next generation of exceptional computing research talent. Microsoft Research PhD Fellowships are awarded to outstanding PhD students who are pursuing research aligned to the Microsoft Research areas of focus.",
      logoUrl: "https://via.placeholder.com/150x150/00A4EF/FFFFFF?text=M",
      referenceUrl: "https://www.microsoft.com/en-us/research/academic-program/phd-fellowship/",
      eligibilityCriteria: "PhD student in computer science, research aligned with Microsoft focus areas",
      applicationProcess: "University nomination with research proposal and references",
      qualificationBasis: "Research excellence and innovation potential",
      awardsAvailable: 30,
      amount: "$42,000 per year for 2 years",
      amountType: "PARTIAL",
      categories: ["COMPUTER_SCIENCE", "ARTIFICIAL_INTELLIGENCE", "DATA_SCIENCE", "CYBERSECURITY"],
      degreeLevels: ["PHD"],
      deadline: new Date('2024-09-15'),
      contactInfo: "phdfellowship@microsoft.com",
      adminId: admin.id,
    },
    {
      title: "Gates Cambridge Scholarship",
      description: "Full-cost scholarship for international students at Cambridge",
      detailedDescription: "The Gates Cambridge Scholarship is one of the most prestigious international scholarships in the world. Scholars become part of the lifelong Gates Cambridge community of over 1,700 alumni from more than 100 countries.",
      logoUrl: "https://via.placeholder.com/150x150/1F4E79/FFFFFF?text=G",
      referenceUrl: "https://www.gatescambridge.org/",
      eligibilityCriteria: "International student, applying to Cambridge graduate program, outstanding academic achievement",
      applicationProcess: "Separate application with essays and references",
      qualificationBasis: "Academic excellence, leadership potential, and commitment to improving lives",
      awardsAvailable: 80,
      amount: "Full cost of study",
      amountType: "FULL",
      categories: ["MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY"],
      degreeLevels: ["MASTER", "PHD"],
      deadline: new Date('2024-12-05'),
      contactInfo: "info@gatescambridge.org",
      adminId: admin.id,
    }
  ]

  // Create scholarships (idempotent by title + admin)
  for (const scholarshipData of scholarships) {
    const exists = await prisma.scholarship.findFirst({
      where: { title: scholarshipData.title, adminId: admin.id }
    })
    if (exists) continue

    await prisma.scholarship.create({
      data: {
        ...scholarshipData,
        amountType: scholarshipData.amountType as any,
        approvalStatus: 'APPROVED' as const
      },
    })
  }

  // Create some saved scholarships for the student
  const createdScholarships = await prisma.scholarship.findMany()
  if (createdScholarships.length > 0) {
    await prisma.savedScholarship.upsert({
      where: {
        userId_scholarshipId: {
          userId: student.id,
          scholarshipId: createdScholarships[0].id
        }
      },
      update: {},
      create: {
        userId: student.id,
        scholarshipId: createdScholarships[0].id,
      },
    })
  }

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        message: "New scholarship matching your profile: Google Generation Scholarship",
        type: "NEW_SCHOLARSHIP",
      },
      {
        userId: student.id,
        message: "Deadline reminder: Chevening Scholarship closes in 30 days",
        type: "DEADLINE_REMINDER",
      },
      {
        userId: student.id,
        message: "Your application to MIT Presidential Fellowship has been received",
        type: "APPLICATION_UPDATE",
      }
    ],
    skipDuplicates: true,
  })

  // Create sample resources
  const resources = [
    {
      title: "Scholarship Application Guide 2024",
      fileUrl: "https://example.com/application-guide.pdf",
      type: "GUIDE" as const,
      category: "COMPUTER_SCIENCE" as const,
      description: "Comprehensive guide for computer science scholarship applications",
      adminId: admin.id,
    },
    {
      title: "Scholarship Calendar 2024-2025",
      fileUrl: "https://example.com/scholarship-calendar.pdf",
      type: "SCHOLARSHIP_CALENDAR" as const,
      category: "OTHER" as const,
      description: "Complete calendar of scholarship deadlines for the academic year",
      adminId: admin.id,
    },
    {
      title: "CV Template for Tech Students",
      fileUrl: "https://example.com/cv-template.docx",
      type: "CV_RESUME_TEMPLATE" as const,
      category: "COMPUTER_SCIENCE" as const,
      description: "Professional CV template designed for technology students",
      adminId: admin.id,
    },
    {
      title: "Personal Statement Writing Guide",
      fileUrl: "https://example.com/personal-statement-guide.pdf",
      type: "PERSONAL_STATEMENT_GUIDE" as const,
      category: "OTHER" as const,
      description: "Step-by-step guide to writing compelling personal statements",
      adminId: admin.id,
    }
  ]

  for (const resourceData of resources) {
    const exists = await prisma.resource.findFirst({
      where: { title: resourceData.title, adminId: admin.id }
    })
    if (exists) continue

    await prisma.resource.create({
      data: resourceData,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created admin user: ${admin.email}`)
  console.log(`👤 Created student user: ${student.email}`)
  console.log(`🎓 Created ${scholarships.length} scholarships`)
  console.log(`📚 Created ${resources.length} resources`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
