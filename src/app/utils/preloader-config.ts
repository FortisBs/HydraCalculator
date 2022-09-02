import { NgxUiLoaderConfig } from "ngx-ui-loader";

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

function getColor(): string {
  if (localStorage.getItem('user-theme') === 'light-theme') {
    return '#FAFAFA';
  }

  if (localStorage.getItem('user-theme') === 'dark-theme') {
    return '#303030';
  }

  return '#FAFAFA';
}
