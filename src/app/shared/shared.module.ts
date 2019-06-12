import { NgModule } from '@angular/core';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ImagePickerComponent],
    imports: [CommonModule, IonicModule],
    exports: [ImagePickerComponent]
})
export class SharedModule {}