import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-HowItWork',
  templateUrl: './HowItWork.component.html',
  styleUrls: ['./HowItWork.component.css']
})
export class HowItWorkComponent implements OnInit, OnDestroy {
  activeTab: 'client' | 'doctor' | 'center' = 'client';
  private autoSwitchInterval: any;
  private readonly tabs: ('client' | 'doctor' | 'center')[] = ['client', 'doctor', 'center'];
  private currentTabIndex = 0;

  constructor() { }

  ngOnInit() {
    this.startAutoSwitch();
  }

  ngOnDestroy() {
    this.stopAutoSwitch();
  }

  setActiveTab(tab: 'client' | 'doctor' | 'center') {
    this.activeTab = tab;
    this.currentTabIndex = this.tabs.indexOf(tab);
    // Restart auto-switch when user manually changes tab
    this.restartAutoSwitch();
    this.activateAllSteps();
  }

  private startAutoSwitch() {
    this.autoSwitchInterval = setInterval(() => {
      this.currentTabIndex = (this.currentTabIndex + 1) % this.tabs.length;
      this.activeTab = this.tabs[this.currentTabIndex];
      this.activateAllSteps();
    }, 6000); // 6 seconds for tab switching
  }

  private stopAutoSwitch() {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
  }

  private restartAutoSwitch() {
    this.stopAutoSwitch();
    this.startAutoSwitch();
  }

  private activateAllSteps() {
    // Activate all steps in the active panel
    const activePanel = document.querySelector(`.content-panel.active`);
    if (activePanel) {
      const stepCards = activePanel.querySelectorAll('.step-card');
      stepCards.forEach(card => {
        card.classList.add('active');
      });
    }
  }
}
