import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-ChooseSystem',
  templateUrl: './HowITWork.component.html',
  styleUrls: ['./HowITWork.component.css'],
  imports:[CommonModule]
})
export class ChooseSystemComponent   {

features: { icon: SafeHtml; title: string; description: string }[] = [];
constructor(private sanitizer: DomSanitizer) {
this.features = [
  {
    title: '<strong>Smart Queue Alerts</strong>',
    description: 'Get notified when your turn is near with intelligent predictions.',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 4.68727V3.75H13.5V4.68731C16.1369 5.35963 18.0833 7.76335 18.0833 10.6184V15.3158C18.0833 15.7194 18.2193 16.2984 18.3833 16.8298C18.4618 17.0841 18.5405 17.3084 18.5996 17.4689C18.6291 17.5489 18.6534 17.6125 18.6701 17.6553L18.6891 17.7034L18.6936 17.7147L18.6945 17.717L18 18.75H5.99996L5.30542 17.717L5.30632 17.7147L5.31085 17.7034L5.32979 17.6553C5.3465 17.6125 5.37086 17.5489 5.40032 17.4689C5.45941 17.3084 5.53817 17.0841 5.61665 16.8298C5.78067 16.2984 5.91663 15.7194 5.91663 15.3158V10.6184C5.91663 7.76329 7.8631 5.35953 10.5 4.68727ZM12 6C9.47329 6 7.41663 8.06309 7.41663 10.6184V15.3158C7.41663 15.9518 7.22451 16.7031 7.05676 17.25H16.9432C16.7754 16.7031 16.5833 15.9518 16.5833 15.3158V10.6184C16.5833 8.06309 14.5266 6 12 6ZM15 21H9.00004V19.5H15V21Z" fill="#2a6f97"></path> </g></svg>
    `)
  },
  {
    title: '<strong>Time-saving Experience</strong>',
    description: 'Eliminate long wait times and improve efficiency.',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2a6f97"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#2a6f97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 6V12" stroke="#2a6f97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16.24 16.24L12 12" stroke="#2a6f97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    `)
  },
  {
    title: '<strong>Multi-branch Support</strong>',
    description: 'Manage multiple locations easily from one dashboard.',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
   <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#2a6f97" stroke="#2a6f97"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#2a6f97" d="M60,58c0-2.209-1.791-4-4-4h-2V25h6c1.795,0,3.369-1.194,3.852-2.922c0.484-1.728-0.242-3.566-1.775-4.497 l-28-17C33.439,0.193,32.719,0,32,0s-1.438,0.193-2.076,0.581l-28,17c-1.533,0.931-2.26,2.77-1.775,4.497 C0.632,23.806,2.207,25,4,25h6v29H8c-2.209,0-4,1.791-4,4c-2.209,0-4,1.791-4,4v2h64v-2C64,59.791,62.209,58,60,58z M52,54h-4V25h4 V54z M18,25h4v29h-4V25z M24,25h4v29h-4V25z M30,25h4v29h-4V25z M36,25h4v29h-4V25z M42,25h4v29h-4V25z M4,23 c-0.893,0-1.685-0.601-1.926-1.462c-0.241-0.859,0.124-1.784,0.888-2.247l28-17.001C31.275,2.1,31.635,2,32,2 c0.367,0,0.725,0.1,1.039,0.291l28,17c0.764,0.463,1.129,1.388,0.887,2.248C61.686,22.399,60.893,23,60,23H4z M12,25h4v29h-4V25z M8,56h48c1.105,0,2,0.896,2,2H6C6,56.896,6.896,56,8,56z M2,62c0-1.104,0.896-2,2-2h56c1.105,0,2,0.896,2,2H2z"></path> <path fill="#2a6f97" d="M32,9c-2.762,0-5,2.238-5,5s2.238,5,5,5s5-2.238,5-5S34.762,9,32,9z M32,17c-1.656,0-3-1.343-3-3 s1.344-3,3-3c1.658,0,3,1.343,3,3S33.658,17,32,17z"></path> </g> </g></svg>
    `)
  },
  {
    title: '<strong>Instant Setup</strong>',
    description: 'Start using the system in just minutes.',
     icon: this.sanitizer.bypassSecurityTrustHtml(`
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2a6f97"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ></path> </g></svg>
    `)
  },
  {
    title: '<strong>Real-time Screens</strong>',
    description: 'Display queue status across all branches in real time.',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6M12 16H19C19.5523 16 20 15.5523 20 15V10" stroke="#2a6f97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    `)
  },
  {
    title: '<strong>Secure & Reliable</strong>',
    description: 'Your data is protected with high security standards.',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.15" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#2a6f97"></path> <path d="M17.0001 9L10 16L7 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#2a6f97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    `)
  }
];

}


}
