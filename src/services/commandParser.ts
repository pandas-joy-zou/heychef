export interface ParsedCommand {
  action: 'start' | 'next' | 'previous' | 'repeat' | 'ingredients' | 'timer' | 'query' | 'pause' | 'resume' | 'stop' | 'unknown';
  parameter?: string | number;
}

export class CommandParserService {
  parse_command(command: string): ParsedCommand {
    const lower_command = command.toLowerCase().trim();

    if (lower_command.includes('start') && lower_command.includes('recipe')) {
      return { action: 'start' };
    }

    if (lower_command.includes('begin') || lower_command.includes('start cooking')) {
      return { action: 'start' };
    }

    if (lower_command.includes('next') || lower_command.includes('forward')) {
      return { action: 'next' };
    }

    if (lower_command.includes('previous') || lower_command.includes('back') || lower_command.includes('last step')) {
      return { action: 'previous' };
    }

    if (lower_command.includes('repeat') || lower_command.includes('again') || lower_command.includes('say that again')) {
      return { action: 'repeat' };
    }

    if (lower_command.includes('ingredient')) {
      return { action: 'ingredients' };
    }

    if (lower_command.includes('timer') || lower_command.includes('set a timer')) {
      const timer_match = this.extract_timer_duration(lower_command);
      if (timer_match) {
        return { action: 'timer', parameter: timer_match };
      }
    }

    if (lower_command.includes('pause timer')) {
      return { action: 'pause' };
    }

    if (lower_command.includes('resume timer') || lower_command.includes('continue timer')) {
      return { action: 'resume' };
    }

    if (lower_command.includes('stop timer') || lower_command.includes('cancel timer')) {
      return { action: 'stop' };
    }

    if (this.is_ingredient_query(lower_command)) {
      return { action: 'query', parameter: lower_command };
    }

    return { action: 'unknown' };
  }

  private extract_timer_duration(command: string): number | null {
    const minute_match = command.match(/(\d+)\s*minute/);
    const second_match = command.match(/(\d+)\s*second/);

    let totalSeconds = 0;
    if (minute_match) {
      totalSeconds += parseInt(minute_match[1]) * 60;
    }

    if (second_match) {
      totalSeconds += parseInt(second_match[1]);
    }

    return totalSeconds > 0 ? totalSeconds : null;
  }

  private is_ingredient_query(command: string): boolean {
    const query_keywords = ['how much', 'how many', 'what', 'do i need', 'amount of'];
    return query_keywords.some(keyword => command.includes(keyword));
  }

  extract_ingredient_keyword(query: string): string {
    const cleaned = query
      .replace(/how much/gi, '')
      .replace(/how many/gi, '')
      .replace(/what/gi, '')
      .replace(/do i need/gi, '')
      .replace(/amount of/gi, '')
      .trim();
    return cleaned;
  }
}

export const commandParser = new CommandParserService();
