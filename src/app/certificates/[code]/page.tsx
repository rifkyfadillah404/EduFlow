import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PrintButton } from '@/components/certificates/print-button'
import Link from 'next/link'

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  const cert = await prisma.certificate.findUnique({
    where: { certificateCode: code },
    include: {
      user: { select: { name: true } },
      course: {
        include: {
          instructor: { select: { name: true } }
        }
      }
    }
  })

  if (!cert) notFound()

  return (
    <div className="container mx-auto p-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl aspect-[1.414] border-8 border-[var(--border-color)] bg-[var(--surface-secondary)] p-2 md:p-8 flex flex-col relative overflow-hidden certificate-container shadow-2xl">
        {/* Certificate inner border */}
        <div className="flex-1 border-2 border-[var(--ink-dimmer)] p-6 md:p-12 flex flex-col justify-between text-center relative z-10">

          <div className="pt-8">
            <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-[var(--ink-faint)] mb-12">
              Certificate of Completion
            </h3>

            <p className="text-lg md:text-xl text-[var(--ink-faint)] mb-4">This is to certify that</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-[var(--accent)] capitalize">
              {cert.user.name}
            </h1>

            <p className="text-lg md:text-xl text-[var(--ink-faint)] mb-4">has successfully completed the course</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-16">
              {cert.course.title}
            </h2>
          </div>

          <div className="flex justify-between items-end pb-8">
            <div className="text-left w-48">
              <div className="border-b-2 border-[var(--ink)] mb-2 pb-2">
                <span className="font-signature text-2xl font-medium">{cert.course.instructor.name}</span>
              </div>
              <p className="text-sm font-semibold uppercase">Instructor</p>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-[#2E90FA] flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-[#2E90FA]"></div>
              <span className="font-bold text-[#2E90FA] text-xs uppercase tracking-widest text-center">Edu<br/>Flow</span>
            </div>

            <div className="text-right w-48">
              <div className="border-b-2 border-[var(--ink)] mb-2 pb-2">
                <span className="text-lg font-medium">{cert.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <p className="text-sm font-semibold uppercase">Date Issued</p>
            </div>
          </div>
        </div>

        {/* Certificate background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-bl-[100%] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent-orange)]/5 rounded-tr-[100%] pointer-events-none"></div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm font-mono text-[var(--ink-faint)]">ID: {cert.certificateCode}</p>
        <div className="flex gap-4 mt-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <PrintButton />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .certificate-container, .certificate-container * { visibility: visible; }
          .certificate-container { position: absolute; left: 0; top: 0; width: 100vw; box-shadow: none; border-width: 4px; }
        }
      `}} />
    </div>
  )
}
