import NavigationService from './navigationService';

export default function PushRouter({ pageType, page, ...params }) {
  if (pageType === 'native') {
    NavigationService.navigate(page, params);
  } else if (pageType === 'web') {
    if (params.url) {
      // params  url,title
      NavigationService.navigate('WebView', params);
    }
  }
}
