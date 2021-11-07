import { NgModule } from '@angular/core';
import {
  ArrowRight,
  Award,
  BellOff,
  ChevronRight,
  Globe,
  Heart,
  Home,
  Layers,
  Lock,
  Mail,
  Maximize2,
  Menu,
  Monitor,
  Package,
  Share,
  Share2,
  Tag,
  Users,
  X,
  Zap,
} from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

@NgModule({
  imports: [
    FeatherModule.pick({
      Lock,
      Award,
      Globe,
      Package,
      Heart,
      Monitor,
      ArrowRight,
      Menu,
      X,
      Home,
      Zap,
      Share2,
      Layers,
      Users,
      BellOff,
      Share,
      Maximize2,
      ChevronRight,
      Mail,
      Tag,
    }),
  ],
  exports: [FeatherModule],
})
export class IconsModule {}
