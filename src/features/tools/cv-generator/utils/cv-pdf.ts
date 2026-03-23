import { jsPDF } from 'jspdf'
import type { CvFontFamily, CvResume, CvTemplate } from './cv-model'
import { formatRange, nonEmpty, nonEmptyList } from './cv-format'
import { cvTemplateDesign, resolveCvTheme, themeHexToRgb, type CvThemePalette } from './cv-design'
import { createLayoutConfig, type CvLayoutConfig } from './cv-layout-config'
import { registerPdfFont, type CvFontId } from './cv-fonts'

export type CvPdfLabels = {
  summary: string
  work: string
  projects: string
  education: string
  skills: string
  languages: string
  profiles: string
  gpa: string
  courses: string
  untitled: string
}

type Rgb = [number, number, number]

type FontName = 'helvetica' | 'times' | 'courier' | string

type PdfStyle = {
  fontStyle?: 'normal' | 'bold'
  fontSize?: number
  color?: Rgb
  lineFactor?: number
  gapAfter?: number
}

type PdfCursor = {
  page: number
  x: number
  y: number
  width: number
}

type PdfTheme = {
  primary: Rgb
  text: Rgb
  muted: Rgb
  divider: Rgb
}

type PdfLayout = {
  template: CvTemplate
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
  }
  fontSizes: {
    h1: number
    h2: number
    h3: number
    body: number
    meta: number
  }
  lineHeight: {
    tight: number
    normal: number
    loose: number
  }
  marginX: number
  topMargin: number
  bottomMargin: number
  withSectionDividers: boolean
}

type PdfContext = {
  doc: jsPDF
  labels: CvPdfLabels
  fontName: FontName
  theme: PdfTheme
  layout: PdfLayout
  onPageAdded?: (page: number) => void
}

type SectionVariant = {
  compact?: boolean
  divider?: boolean
  useBullets?: boolean
}

const defaultFontMap: Record<string, FontName> = {
  inter: 'helvetica',
  roboto: 'helvetica',
  'open-sans': 'helvetica',
  'noto-sans': 'helvetica',
  'be-vietnam-pro': 'helvetica',
}

const toPdfTheme = (palette: CvThemePalette): PdfTheme => ({
  primary: themeHexToRgb(palette.primary),
  text: themeHexToRgb(palette.text),
  muted: themeHexToRgb(palette.muted),
  divider: themeHexToRgb(palette.divider),
})

const toLayout = (layoutCfg: CvLayoutConfig): PdfLayout => ({
  template: layoutCfg.template,
  spacing: layoutCfg.spacing,
  fontSizes: layoutCfg.typography.fontSizes,
  lineHeight: layoutCfg.typography.lineHeight,
  marginX: layoutCfg.page.marginX,
  topMargin: layoutCfg.page.marginTop,
  bottomMargin: layoutCfg.page.marginBottom,
  withSectionDividers: layoutCfg.withSectionDividers,
})

const pageBottom = (ctx: PdfContext): number => ctx.doc.internal.pageSize.getHeight() - ctx.layout.bottomMargin
const nameColor: Rgb = [17, 24, 39]

const lineHeightMm = (fontSize: number, lineFactor: number): number => fontSize * 0.3528 * lineFactor

const setStyle = (ctx: PdfContext, style: PdfStyle = {}) => {
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const fontStyle = style.fontStyle ?? 'normal'
  const color = style.color ?? ctx.theme.text

  ctx.doc.setFont(ctx.fontName, fontStyle)
  ctx.doc.setFontSize(fontSize)
  ctx.doc.setTextColor(color[0], color[1], color[2])
  ctx.doc.setLineHeightFactor(style.lineFactor ?? ctx.layout.lineHeight.normal)
}

const ensureSpace = (ctx: PdfContext, cursor: PdfCursor, neededHeight: number) => {
  if (cursor.y + neededHeight <= pageBottom(ctx)) {
    return
  }

  cursor.page += 1
  if (cursor.page > ctx.doc.getNumberOfPages()) {
    ctx.doc.addPage()
  }
  ctx.doc.setPage(cursor.page)
  cursor.y = ctx.layout.topMargin
  ctx.onPageAdded?.(cursor.page)
}

const splitLines = (ctx: PdfContext, text: string, maxWidth: number, style: PdfStyle = {}): string[] => {
  setStyle(ctx, style)
  return ctx.doc.splitTextToSize(text, maxWidth) as string[]
}

const textHeight = (ctx: PdfContext, text: string, width: number, style: PdfStyle = {}): number => {
  const trimmed = text.trim()
  if (!trimmed) {
    return 0
  }

  const lines = splitLines(ctx, trimmed, width, style)
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)
  return lines.length * lineHeight + (style.gapAfter ?? 0)
}

const writeWrapped = (ctx: PdfContext, cursor: PdfCursor, text: string, style: PdfStyle = {}) => {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  const lines = splitLines(ctx, trimmed, cursor.width, style)
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)

  setStyle(ctx, style)

  lines.forEach((line) => {
    ensureSpace(ctx, cursor, lineHeight)
    ctx.doc.setPage(cursor.page)
    // CSS line box centers the text. The top of the line box is cursor.y.
    // The font's em-box top needs to be pushed down by the half-leading.
    const halfLeading = (lineHeight - fontSize * 0.3528) / 2
    ctx.doc.text(line, cursor.x, cursor.y + halfLeading, { baseline: 'top' })
    cursor.y += lineHeight
  })

  cursor.y += style.gapAfter ?? 0
}

const writeBullet = (ctx: PdfContext, cursor: PdfCursor, text: string, style: PdfStyle = {}) => {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  const bulletIndent = 4.2
  const contentStyle = { ...style }
  const lines = splitLines(ctx, trimmed, cursor.width - bulletIndent, contentStyle)
  if (lines.length === 0) {
    return
  }

  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)
  const halfLeading = (lineHeight - fontSize * 0.3528) / 2
  setStyle(ctx, contentStyle)

  ensureSpace(ctx, cursor, lineHeight)
  ctx.doc.setPage(cursor.page)
  ctx.doc.text('•', cursor.x + 0.8, cursor.y + halfLeading, { baseline: 'top' })
  ctx.doc.text(lines[0], cursor.x + bulletIndent, cursor.y + halfLeading, { baseline: 'top' })
  cursor.y += lineHeight

  lines.slice(1).forEach((line) => {
    ensureSpace(ctx, cursor, lineHeight)
    ctx.doc.setPage(cursor.page)
    ctx.doc.text(line, cursor.x + bulletIndent, cursor.y + halfLeading, { baseline: 'top' })
    cursor.y += lineHeight
  })

  cursor.y += style.gapAfter ?? 0
}

const writeSectionDivider = (ctx: PdfContext, cursor: PdfCursor, color: Rgb = ctx.theme.divider, thickness = 0.2) => {
  const bottomGap = ctx.layout.spacing.sm // .cv-section gap applies after title divider
  ensureSpace(ctx, cursor, bottomGap + thickness)
  ctx.doc.setPage(cursor.page)
  ctx.doc.setDrawColor(color[0], color[1], color[2])
  ctx.doc.setLineWidth(thickness)
  ctx.doc.line(cursor.x, cursor.y, cursor.x + cursor.width, cursor.y)
  cursor.y += bottomGap
}

const writeItemDivider = (ctx: PdfContext, cursor: PdfCursor, dashed = false) => {
  const gap = ctx.layout.spacing.sm // .cv-section row-gap applies between items
  const paddingTop = ctx.layout.spacing.sm // .cv-item + .cv-item padding-top
  const thickness = 0.2

  ensureSpace(ctx, cursor, gap + thickness + paddingTop)
  cursor.y += gap

  ctx.doc.setPage(cursor.page)
  ctx.doc.setDrawColor(ctx.theme.divider[0], ctx.theme.divider[1], ctx.theme.divider[2])
  ctx.doc.setLineWidth(thickness)
  
  if (dashed) {
    ctx.doc.setLineDashPattern([1, 1], 0)
    ctx.doc.line(cursor.x, cursor.y, cursor.x + cursor.width, cursor.y)
    ctx.doc.setLineDashPattern([], 0)
  } else {
    ctx.doc.line(cursor.x, cursor.y, cursor.x + cursor.width, cursor.y)
  }
  
  cursor.y += paddingTop
}

const writeSectionTitle = (ctx: PdfContext, cursor: PdfCursor, title: string, variant: SectionVariant = {}) => {
  const compact = Boolean(variant.compact)
  const divider = variant.divider ?? ctx.layout.withSectionDividers
  
  writeWrapped(ctx, cursor, title, {
    fontStyle: 'bold',
    fontSize: compact ? ctx.layout.fontSizes.h3 : ctx.layout.fontSizes.h2,
    color: ctx.theme.primary,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: divider ? ctx.layout.spacing.xs : ctx.layout.spacing.sm, // padding-bottom or section gap
  })

  if (divider) {
    writeSectionDivider(ctx, cursor)
  }
}

const writeSectionTail = (ctx: PdfContext, cursor: PdfCursor) => {
  cursor.y += ctx.layout.spacing.md // .cv-template gap
}

const writeHeaderClassic = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  writeWrapped(ctx, cursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.sm, // .cv-head gap
  })

  if (role) {
    writeWrapped(ctx, cursor, role, {
      fontSize: ctx.layout.fontSizes.h2,
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.sm, // .cv-head gap
    })
  }

  if (contacts.length > 0) {
    writeWrapped(ctx, cursor, contacts.join(' | '), {
      fontSize: ctx.layout.fontSizes.meta,
      color: ctx.theme.muted,
      lineFactor: ctx.layout.lineHeight.normal,
      gapAfter: ctx.layout.spacing.md, // .cv-head padding-bottom
    })
  }

  writeSectionDivider(ctx, cursor, ctx.theme.primary, 0.4) // 1.5px border
}

const writeHeaderMinimal = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  const leftWidth = cursor.width * 0.6
  const rightWidth = cursor.width * 0.4
  const startY = cursor.y

  // Left column (name & role)
  const leftCursor = { ...cursor, width: leftWidth }
  writeWrapped(ctx, leftCursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.sm,
  })

  if (role) {
    writeWrapped(ctx, leftCursor, role, {
      fontSize: ctx.layout.fontSizes.h2, // Actually minimal css uses h2 size but sets to h2
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.md,
    })
  }
  const letfY = leftCursor.y

  // Right column (contacts stack)
  const rightCursor = { ...cursor, x: cursor.x + leftWidth, y: startY, width: rightWidth }
  if (contacts.length > 0) {
    contacts.forEach((contact, idx) => {
      // Right-aligned text
      setStyle(ctx, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
      })
      const lineHeight = lineHeightMm(ctx.layout.fontSizes.meta, ctx.layout.lineHeight.normal)
      ensureSpace(ctx, rightCursor, lineHeight)
      ctx.doc.setPage(rightCursor.page)
      // Get exact text width and right-align
      const halfLeading = (lineHeight - ctx.layout.fontSizes.meta * 0.3528) / 2
      const yBase = rightCursor.y + halfLeading
      ctx.doc.text(contact, rightCursor.x + rightWidth, yBase, { align: 'right', baseline: 'top' })
      rightCursor.y += lineHeight + ctx.layout.spacing.xs
    })
    rightCursor.y += ctx.layout.spacing.md - ctx.layout.spacing.xs
  }
  
  cursor.y = Math.max(letfY, rightCursor.y)
  writeSectionDivider(ctx, cursor, ctx.theme.divider, 0.2) // Minimal 0.5px border
}

const writeHeaderModern = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  writeWrapped(ctx, cursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.sm, // cv-head gap
  })

  if (role) {
    writeWrapped(ctx, cursor, role, {
      fontSize: ctx.layout.fontSizes.h2,
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.sm, // cv-head gap
    })
  }

  if (contacts.length > 0) {
    writeWrapped(ctx, cursor, contacts.join('   |   '), {
      fontSize: ctx.layout.fontSizes.meta,
      color: ctx.theme.muted,
      lineFactor: ctx.layout.lineHeight.normal,
      gapAfter: ctx.layout.spacing.md, // padding-bottom before divider
    })
  }

  writeSectionDivider(ctx, cursor, ctx.theme.primary, 0.4) // 1.5px border
}

const writeSummary = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  if (!nonEmpty(resume.basics.summary)) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.summary, variant)
  writeWrapped(ctx, cursor, resume.basics.summary, {
    fontSize: variant.compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
    color: ctx.theme.text,
    lineFactor: ctx.layout.lineHeight.loose,
    gapAfter: 0,
  })
  writeSectionTail(ctx, cursor)
}

const writeItemHeading = (ctx: PdfContext, cursor: PdfCursor, title: string, meta: string, compact = false) => {
  const headingSize = compact ? ctx.layout.fontSizes.h3 : ctx.layout.fontSizes.h3 + 0.2
  const metaSize = ctx.layout.fontSizes.meta

  const titleStyle: PdfStyle = {
    fontStyle: 'bold',
    fontSize: headingSize,
    lineFactor: ctx.layout.lineHeight.tight,
    color: ctx.theme.text,
  }

  const metaStyle: PdfStyle = {
    fontSize: metaSize,
    lineFactor: ctx.layout.lineHeight.tight,
    color: ctx.theme.muted,
  }

  const titleHeight = textHeight(ctx, title, cursor.width - 28, titleStyle)
  const metaHeight = meta ? textHeight(ctx, meta, 28, metaStyle) : 0
  ensureSpace(ctx, cursor, Math.max(titleHeight, metaHeight, ctx.layout.spacing.md))

  writeWrapped(ctx, cursor, title, { ...titleStyle, gapAfter: 0 })

  if (meta) {
    const metaLineHeight = lineHeightMm(metaStyle.fontSize ?? metaSize, metaStyle.lineFactor ?? ctx.layout.lineHeight.tight)
    const halfLeading = (metaLineHeight - (metaStyle.fontSize ?? metaSize) * 0.3528) / 2
    
    // We want the text to start at exactly the same y offset as the heading text block
    // No need to trace baseline upwards; both start their box at cursor.y
    const startY = cursor.y - textHeight(ctx, title, cursor.width - 28, titleStyle)
    
    setStyle(ctx, metaStyle)
    ctx.doc.setPage(cursor.page)
    ctx.doc.text(meta, cursor.x + cursor.width, startY + halfLeading, { align: 'right', baseline: 'top' })
  }
}

const writeWork = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.work.filter(
    (item) => nonEmpty(item.position) || nonEmpty(item.name) || nonEmpty(item.summary) || nonEmptyList(item.highlights).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.work, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const title = [item.position.trim() || ctx.labels.untitled, item.name.trim()].filter((entry) => entry.length > 0).join(' - ')
    const dateRange = formatRange(item.startDate, item.endDate)

    writeItemHeading(ctx, cursor, title, dateRange, compact)

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    }

    if (nonEmpty(item.summary)) {
      writeWrapped(ctx, cursor, item.summary, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.loose,
        gapAfter: 0,
      })
    }

    const highlights = nonEmptyList(item.highlights)
    if (variant.useBullets === false) {
      if (highlights.length > 0) {
        writeWrapped(ctx, cursor, highlights.join(' | '), {
          fontSize: ctx.layout.fontSizes.meta,
          color: ctx.theme.muted,
          lineFactor: ctx.layout.lineHeight.normal,
          gapAfter: 0,
        })
      }
    } else {
      if (highlights.length > 0) {
        cursor.y += ctx.layout.spacing.xs // Margin top for bullets list
      }
      highlights.forEach((highlight, i) => {
        writeBullet(ctx, cursor, highlight, {
          fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
          lineFactor: ctx.layout.lineHeight.normal,
          gapAfter: i < highlights.length - 1 ? ctx.layout.spacing.xs : 0, // List gap var(--cv-space-xs)
        })
      })
    }

    if (index < items.length - 1) {
      writeItemDivider(ctx, cursor, !variant.divider) // Use dashed if we are in minimal (which passed divider: false for section)
    }
  })
  writeSectionTail(ctx, cursor)
}

const writeProjects = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.projects.filter(
    (item) => nonEmpty(item.name) || nonEmpty(item.description) || nonEmpty(item.url) || nonEmptyList(item.highlights).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.projects, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const dateRange = formatRange(item.startDate, item.endDate)
    writeItemHeading(ctx, cursor, item.name.trim() || ctx.labels.untitled, dateRange, compact)

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    }

    if (nonEmpty(item.description)) {
      writeWrapped(ctx, cursor, item.description, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.loose,
        gapAfter: 0,
      })
    }

    const highlights = nonEmptyList(item.highlights)
    if (variant.useBullets === false) {
      if (highlights.length > 0) {
        writeWrapped(ctx, cursor, highlights.join(' | '), {
          fontSize: ctx.layout.fontSizes.meta,
          color: ctx.theme.muted,
          lineFactor: ctx.layout.lineHeight.normal,
          gapAfter: 0,
        })
      }
    } else {
      if (highlights.length > 0) {
        cursor.y += ctx.layout.spacing.xs
      }
      highlights.forEach((highlight, i) => {
        writeBullet(ctx, cursor, highlight, {
          fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
          lineFactor: ctx.layout.lineHeight.normal,
          gapAfter: i < highlights.length - 1 ? ctx.layout.spacing.xs : 0,
        })
      })
    }

    if (index < items.length - 1) {
      writeItemDivider(ctx, cursor, !variant.divider)
    }
  })
  writeSectionTail(ctx, cursor)
}

const writeEducation = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.education.filter(
    (item) => nonEmpty(item.institution) || nonEmpty(item.studyType) || nonEmpty(item.area) || nonEmptyList(item.courses).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.education, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const dateRange = formatRange(item.startDate, item.endDate)
    writeItemHeading(ctx, cursor, item.institution.trim() || ctx.labels.untitled, dateRange, compact)

    const degreeParts = [item.studyType.trim(), item.area.trim()].filter((entry) => entry.length > 0)
    const degreeLine = [degreeParts.join(' - '), nonEmpty(item.score) ? `${ctx.labels.gpa}: ${item.score.trim()}` : '']
      .filter((entry) => entry.length > 0)
      .join(' | ')

    if (degreeLine) {
      writeWrapped(ctx, cursor, degreeLine, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    }

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    }

    const courses = nonEmptyList(item.courses)
    if (courses.length > 0) {
      writeWrapped(ctx, cursor, `${ctx.labels.courses}: ${courses.join(' • ')}`, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    }

    if (index < items.length - 1) {
      writeItemDivider(ctx, cursor, !variant.divider)
    }
  })
  writeSectionTail(ctx, cursor)
}

const writeStackedEntry = (
  ctx: PdfContext,
  cursor: PdfCursor,
  label: string,
  details: string[],
  compact = false
) => {
  const titleSize = compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body
  const detailSize = compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body

  writeWrapped(ctx, cursor, label, {
    fontStyle: 'bold',
    fontSize: titleSize,
    color: ctx.theme.text,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: 0, // No gap between strong and p tags in clean HTML list
  })

  details
    .map((detail) => detail.trim())
    .filter((detail) => detail.length > 0)
    .forEach((detail, index, arr) => {
      writeWrapped(ctx, cursor, detail, {
        fontSize: detailSize,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: 0,
      })
    })
}

const writeSkills = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.skills.filter((item) => nonEmpty(item.name) || nonEmpty(item.level) || nonEmptyList(item.keywords).length > 0)
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.skills, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.name.trim() || ctx.labels.untitled
    
    // In classic, it is inline! Use different renderer if useBullets false? No, classic uses one line.
    if (ctx.layout.template === 'classic') {
       const detail = (nonEmpty(item.level) ? `(${item.level}): ` : ': ') + nonEmptyList(item.keywords).join(', ')
       writeStackedEntry(ctx, cursor, label, [detail], compact)
    } else {
       const details = [item.level.trim(), nonEmptyList(item.keywords).join(' • ')].filter((entry) => entry.length > 0)
       writeStackedEntry(ctx, cursor, label, details, compact)
    }

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs // cv-clean-list gap
    }
  })
  writeSectionTail(ctx, cursor)
}

const writeLanguages = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.languages.filter((item) => nonEmpty(item.language) || nonEmpty(item.fluency) || nonEmpty(item.certificate ?? ''))
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.languages, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.language.trim() || ctx.labels.untitled
    if (ctx.layout.template === 'classic' || ctx.layout.template === 'minimal') {
       const details = [`— ${item.fluency.trim()}` + (nonEmpty(item.certificate ?? '') ? ` (${item.certificate})` : '')]
       writeStackedEntry(ctx, cursor, label, details, compact)
    } else {
       const details = [item.fluency.trim(), item.certificate?.trim() ?? ''].filter((entry) => entry.length > 0)
       writeStackedEntry(ctx, cursor, label, details, compact)
    }

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs
    }
  })
  writeSectionTail(ctx, cursor)
}

const writeLabeledValue = (ctx: PdfContext, cursor: PdfCursor, label: string, value: string, compact = false) => {
  const details = nonEmpty(value) ? [value] : []
  writeStackedEntry(ctx, cursor, label, details, compact)
}

const writeProfiles = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.basics.profiles.filter((item) => nonEmpty(item.network) || nonEmpty(item.url))
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.profiles, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.network.trim() || ctx.labels.untitled
    const url = item.url.trim()
    
    if (ctx.layout.template === 'classic' || ctx.layout.template === 'minimal') {
       writeStackedEntry(ctx, cursor, label, [`: ${url}`], compact)
    } else {
       writeLabeledValue(ctx, cursor, label, url, compact)
    }

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs
    }
  })
  writeSectionTail(ctx, cursor)
}

const renderClassicPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const cursor: PdfCursor = {
    page: 1,
    x: ctx.layout.marginX,
    y: ctx.layout.topMargin,
    width: pageWidth - ctx.layout.marginX * 2,
  }

  writeHeaderClassic(ctx, cursor, resume)
  writeSummary(ctx, cursor, resume, { divider: true })
  writeWork(ctx, cursor, resume, { divider: true, useBullets: true })
  writeProjects(ctx, cursor, resume, { divider: true, useBullets: true })
  writeEducation(ctx, cursor, resume, { divider: true })
  writeSkills(ctx, cursor, resume, { divider: true, useBullets: false })
  writeLanguages(ctx, cursor, resume, { divider: true, useBullets: false })
  writeProfiles(ctx, cursor, resume, { divider: true, useBullets: false })
}

const renderMinimalPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const cursor: PdfCursor = {
    page: 1,
    x: ctx.layout.marginX,
    y: ctx.layout.topMargin,
    width: pageWidth - ctx.layout.marginX * 2,
  }

  writeHeaderMinimal(ctx, cursor, resume)
  writeSummary(ctx, cursor, resume, { compact: true, divider: false })
  writeWork(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  writeProjects(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  
  // Minimal side group splitting
  const columns = { leftRatio: 0.5, rightRatio: 0.5, gap: 8 }
  const totalWidth = cursor.width
  const gapMm = columns.gap * 0.2646
  const sideWidth = (totalWidth - gapMm) * 0.5
  
  const leftCursor = { ...cursor, width: sideWidth }
  const startY = leftCursor.y
  
  writeEducation(ctx, leftCursor, resume, { compact: true, divider: false })
  
  const rightCursor = { ...cursor, x: cursor.x + sideWidth + gapMm, y: startY, width: sideWidth }
  writeSkills(ctx, rightCursor, resume, { compact: true, divider: false, useBullets: false })
  writeLanguages(ctx, rightCursor, resume, { compact: true, divider: false, useBullets: false })
  writeProfiles(ctx, rightCursor, resume, { compact: true, divider: false, useBullets: false })
}

const renderModernPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const margin = ctx.layout.marginX
  const columns = cvTemplateDesign.modern.columns ?? { leftRatio: 0.33, rightRatio: 0.67, gap: 8 }
  const totalWidth = pageWidth - margin * 2
  const gapMm = columns.gap * 0.2646
  const leftWidth = (totalWidth - gapMm) * columns.leftRatio
  const rightWidth = (totalWidth - gapMm) * columns.rightRatio

  const header: PdfCursor = {
    page: 1,
    x: margin,
    y: ctx.layout.topMargin,
    width: totalWidth,
  }

  writeHeaderModern(ctx, header, resume)

  // Side background removed in template cleanup
  const startY = header.y
  
  ctx.doc.setDrawColor(ctx.theme.divider[0], ctx.theme.divider[1], ctx.theme.divider[2])
  ctx.doc.setLineWidth(0.2)
  ctx.doc.line(margin + leftWidth + gapMm / 2, startY, margin + leftWidth + gapMm / 2, pageBottom(ctx))

  const leftCursor: PdfCursor = {
    page: 1,
    x: margin,
    y: startY,
    width: leftWidth,
  }
  const rightCursor: PdfCursor = {
    page: 1,
    x: margin + leftWidth + gapMm,
    y: startY,
    width: rightWidth,
  }

  writeProfiles(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })
  writeSkills(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })
  writeLanguages(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })

  writeSummary(ctx, rightCursor, resume, { compact: false, divider: true })
  writeWork(ctx, rightCursor, resume, { compact: false, divider: true, useBullets: true })
  writeProjects(ctx, rightCursor, resume, { compact: false, divider: true, useBullets: true })
  writeEducation(ctx, rightCursor, resume, { compact: false, divider: true })
}

const templateRenderers: Record<CvTemplate, (ctx: PdfContext, resume: CvResume) => void> = {
  classic: renderClassicPdf,
  modern: renderModernPdf,
  minimal: renderMinimalPdf,
}

export const downloadCvPdf = async (resume: CvResume, labels: CvPdfLabels) => {
  const template = resume.meta.template
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  })

  // We explicitly tell PDF not to compress spacing logic etc (handled by layout)
  const layoutCfg = createLayoutConfig(template, resume.meta.themeColor)
  const themePalette = resolveCvTheme(resume.meta.themeColor)
  const fontId = resume.meta.fontFamily as CvFontId

  // Try to register custom font (Vietnamese support)
  let fontName: FontName = defaultFontMap[fontId] ?? 'helvetica'
  try {
    const registered = await registerPdfFont(doc, fontId)
    if (registered.normal !== 'helvetica') {
      fontName = registered.normal as FontName
    }
  } catch (_error) {
    // Fall back to built-in font
  }

  const ctx: PdfContext = {
    doc,
    labels,
    fontName,
    theme: toPdfTheme(themePalette),
    layout: toLayout(layoutCfg),
  }

  const render = templateRenderers[template] ?? renderClassicPdf
  render(ctx, resume)
  doc.save('resume.pdf')
}
