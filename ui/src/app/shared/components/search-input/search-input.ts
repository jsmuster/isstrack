import { Component, input, output, ChangeDetectionStrategy } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.html',
  styleUrls: ['./search-input.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input<string>('Filter by title...')
  ariaLabel = input<string>('Filter by title')
  value = input<string>('')
  valueChange = output<string>()

  onInput(val: string): void {
    this.valueChange.emit(val)
  }
}
