import { NgxUiLoaderConfig } from "ngx-ui-loader";
import { Theme } from "../shared/services/theme.service";

export const preloaderConfig: NgxUiLoaderConfig = {
  "blur": 5,
  "delay": 0,
  "fgsColor": "#673AB7",
  "fgsSize": 100,
  "fgsType": "three-strings",
  "overlayColor": getColor(),
  "hasProgressBar": false,
  "maxTime": 700,
  "minTime": 700
}

export function getColor(): string {
  const userTheme = localStorage.getItem('user-theme') as Theme ?? 'light-theme';
  const lightColor = '#FAFAFA';
  const darkColor = '#303030';

  return userTheme === 'light-theme' ? lightColor : darkColor;
}
