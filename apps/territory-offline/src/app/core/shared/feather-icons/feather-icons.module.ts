import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import
{
  Zap, Inbox, Map, User, Home, Tag, Share2, Layers, Settings, Lock, ArrowRightCircle, Menu, Grid, ArrowRight,
  Plus, Search, Info, CheckCircle, LogIn, Share, ChevronLeft, Trash, Circle, File, Database, ChevronDown, Printer,
  Maximize2, RefreshCw, XCircle, X, Triangle, Minimize2, Edit, Filter, Check, MapPin, MinusCircle, AlertCircle,
  ChevronUp, EyeOff, Globe, Hexagon, FilePlus, Calendar, Archive, LifeBuoy, Shield, MessageSquare, Navigation2,
  BellOff, XOctagon, Crosshair, WifiOff, Users, Sidebar, Download, Heart, Mail, ChevronRight, Repeat, Copy, ChevronsDown,
  ChevronsUp, Bell, Move, RotateCw, ArrowDownCircle, Camera, Eye, LogOut
} from 'angular-feather/icons';

@NgModule({
  imports: [
    FeatherModule.pick({
      Zap, Inbox, Map, User, Home, Tag, Share2, Layers, Settings, Lock, ArrowRightCircle, Menu, Grid, ArrowRight,
      Plus, Search, Info, CheckCircle, LogIn, Share, ChevronLeft, Trash, Circle, File, Database, ChevronDown, Printer,
      Maximize2, RefreshCw, XCircle, X, Triangle, Minimize2, Edit, Filter, Check, MapPin, MinusCircle, AlertCircle,
      ChevronUp, EyeOff, Globe, Hexagon, FilePlus, Calendar, Archive, LifeBuoy, Shield, MessageSquare, Navigation2,
      BellOff, XOctagon, Crosshair, WifiOff, Users, Sidebar, Download, Heart, Mail, ChevronRight, Repeat, Copy, ChevronsDown,
      ChevronsUp, Bell, Move, RotateCw, ArrowDownCircle, Camera, Eye, LogOut
    })
  ],
  exports: [
    FeatherModule
  ]
})
export class FeatherIconsModule { }

// https://github.com/michaelbazos/angular-feather
