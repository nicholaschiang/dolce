export function formatLevelName(level: string): string {
  switch (level) {
    case 'BESPOKE':
      return 'Bespoke'
    case 'COUTURE':
      return 'Couture'
    case 'HANDMADE':
      return 'Handmade'
    case 'RTW':
      return 'RTW'
    default:
      throw new Error(`Unknown level: ${level}`)
  }
}
