export class TimerService {
  private timer_id: NodeJS.Timeout | null = null;
  private remaining_time = 0;
  private on_tick_callback: ((seconds: number) => void) | null = null;
  private on_complete_callback: (() => void) | null = null;

  start_timer(seconds: number) {
    this.stop_timer();
    this.remaining_time = seconds;

    if (this.on_tick_callback) {
      this.on_tick_callback(this.remaining_time);
    }

    this.timer_id = setInterval(() => {
      this.remaining_time--;

      if (this.on_tick_callback) {
        this.on_tick_callback(this.remaining_time);
      }

      if (this.remaining_time <= 0) {
        this.stop_timer();
        if (this.on_complete_callback) {
          this.on_complete_callback();
        }
      }
    }, 1000);
  }

  stop_timer() {
    if (this.timer_id) {
      clearInterval(this.timer_id);
      this.timer_id = null;
    }
    this.remaining_time = 0;
  }

  pause_timer() {
    if (this.timer_id) {
      clearInterval(this.timer_id);
      this.timer_id = null;
    }
  }

  resume_timer() {
    if (this.remaining_time > 0 && !this.timer_id) {
      this.start_timer(this.remaining_time);
    }
  }

  on_tick(callback: (seconds: number) => void) {
    this.on_tick_callback = callback;
  }

  on_complete(callback: () => void) {
    this.on_complete_callback = callback;
  }
}

export const timerService = new TimerService();
