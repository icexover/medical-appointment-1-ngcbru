import type { DaySchedule, TimeSlot, ScheduleStatus } from '@/types'

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function generateTimeSlots(period: 'morning' | 'afternoon' | 'night', count: number, startIdx: number): TimeSlot[] {
  const timeRanges = {
    morning: { start: 8, end: 12, label: '上午' },
    afternoon: { start: 14, end: 17, label: '下午' },
    night: { start: 18, end: 20, label: '夜间' },
  }
  const range = timeRanges[period]
  const slots: TimeSlot[] = []
  const totalMinutes = (range.end - range.start) * 60
  const slotDuration = 30
  const maxSlots = Math.floor(totalMinutes / slotDuration)

  for (let i = 0; i < Math.min(count, maxSlots); i++) {
    const idx = startIdx + i
    const hour = Math.floor(range.start + (idx * slotDuration) / 60)
    const minute = (idx * slotDuration) % 60
    const endHour = Math.floor(range.start + ((idx + 1) * slotDuration) / 60)
    const endMinute = ((idx + 1) * slotDuration) % 60
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}-${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`

    const remaining = Math.floor(Math.random() * 10)
    const total = 15
    const status: ScheduleStatus = remaining === 0 ? 'full' : 'available'

    slots.push({
      id: `slot-${period}-${idx}`,
      time,
      period,
      remaining,
      total,
      status,
    })
  }
  return slots
}

export function generateDaySchedule(dateStr: string, doctorId: string): DaySchedule {
  const date = new Date(dateStr)
  const dayOfWeek = weekDays[date.getDay()]
  const dayOfMonth = date.getDate()
  const doctorNum = parseInt(doctorId.replace(/\D/g, ''))

  const closedDays = [7, 14, 21, 28]
  if (closedDays.includes(dayOfMonth) && doctorNum % 2 === 0) {
    return {
      date: dateStr,
      dayOfWeek,
      status: 'closed',
      timeSlots: [],
    }
  }

  const morningSlots = generateTimeSlots('morning', 6, 0)
  const afternoonSlots = generateTimeSlots('afternoon', 5, 0)
  const hasNight = doctorNum % 3 === 0
  const nightSlots = hasNight ? generateTimeSlots('night', 3, 0) : []

  const allSlots = [...morningSlots, ...afternoonSlots, ...nightSlots]
  const hasAvailable = allSlots.some(s => s.status === 'available')

  return {
    date: dateStr,
    dayOfWeek,
    status: hasAvailable ? 'available' : 'full',
    timeSlots: allSlots,
  }
}

export function generateWeekSchedule(doctorId: string, startDate?: string): DaySchedule[] {
  const schedules: DaySchedule[] = []
  const base = startDate ? new Date(startDate) : new Date()

  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    schedules.push(generateDaySchedule(dateStr, doctorId))
  }
  return schedules
}
