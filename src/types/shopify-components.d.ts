import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'shopify-store': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'store-domain'?: string;
        'public-access-token'?: string;
        country?: string;
        language?: string;
        [key: string]: any;
      };
      'shopify-cart': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        [key: string]: any;
      };
      'shopify-context': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        handle?: string;
        type?: string;
        [key: string]: any;
      };
      'shopify-data': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, any>;
      'shopify-media': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, any>;
      'shopify-money': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, any>;
      'shopify-variant-selector': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, any>;
      'shopify-list-context': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, any>;
    }
  }
}




