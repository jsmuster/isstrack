import { Component, input, output, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'

export interface DropdownOption {
  value: string
  label: string
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  options = input<DropdownOption[]>([])
  value = input<string>('')
  placeholder = input<string>('')
  ariaLabel = input<string>('')
  variant = input<'default' | 'pill'>('default')
  colorClass = input<string>('')

  valueChange = output<string>()

  onSelectChange(val: string): void {
    this.valueChange.emit(val)
  }
}
