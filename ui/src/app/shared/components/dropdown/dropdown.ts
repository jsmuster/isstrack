import { Component, input, signal, forwardRef, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  options = input<DropdownOption[]>([])
  placeholder = input<string>('')
  ariaLabel = input<string>('')
  variant = input<'default' | 'pill'>('default')
  colorClass = input<string>('')

  value = signal<string>('')

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(val: string): void {
    this.value.set(val ?? '')
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  onSelectChange(val: string): void {
    this.value.set(val)
    this.onChange(val)
    this.onTouched()
  }
}
