import { Component, computed, input, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-pager',
  standalone: true,
  templateUrl: './pager.component.html',
})
export class PagerComponent {
  page = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  // first, last, current ± 1, with a null where numbers are skipped
  items = computed<(number | null)[]>(() => {
    const total = this.totalPages();
    const cur = this.page();
    const nums = [...new Set([1, total, cur - 1, cur, cur + 1])]
      .filter((n) => n >= 1 && n <= total)
      .sort((a, b) => a - b);

    const out: (number | null)[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && n - nums[i - 1] > 1) out.push(null);
      out.push(n);
    });
    return out;
  });

  go(n: number) {
    if (n >= 1 && n <= this.totalPages() && n !== this.page()) {
      this.pageChange.emit(n);
    }
  }
}