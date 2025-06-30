import { ITransaction } from './../../models/ITransaction';
import { ClientService } from './../../services/client.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { IClientWalletProfile } from '../../models/IClientWalletProfile';
import { AuthService } from '../../../../services/auth.service';
import { Avatar } from 'primeng/avatar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ClientWallet',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    MessageModule,
    ToastModule,
    Avatar,
  ],
  templateUrl: './ClientWallet.component.html',
  styleUrls: ['./ClientWallet.component.css'],
})
export class ClientWalletComponent implements OnInit {
  ClientService = inject(ClientService);
  cAuthServices = inject(AuthService);
  clientWallet!: IClientWalletProfile;
  userid: string = '';
  balance: number = 0.0;
  showReturnFundDialog: boolean = false;
  returnFundAmount: number | null = null;
  isLoading: boolean = false;
  selectedReturnMethod: 'vodafone' | 'bank' | null = null;
  bankAccountNumber: string = '';
  vodafoneNumber: string = '';

  // Transaction history (empty initially)
  transactions: ITransaction[] = [];

  // Credit/payment methods (for future implementation)
  paymentMethods: string[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.userid = this.cAuthServices.getUserId();
    this.loadBalance();
    this.loadTransactions();
    this.ClientService.ClientWalletAndProfile(this.userid).subscribe({
      next: (res) => {
        this.clientWallet = res.Data;
        this.balance = this.clientWallet.Balance;
        this.clientWallet.Image = `${environment.apiUrl}${this.clientWallet.Image}`;
      },
      error: (err) => {
        console.error('Error while fetching client wallet profile:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load wallet profile. Please try again later.',
        });
      },
    });
  }

  loadBalance() {
    // Simulate loading balance from backend
    // In real app, this would be an API call
    this.balance = 0.0;
  }

  loadTransactions() {
    // Simulate loading transaction history
    // In real app, this would be an API call
    this.transactions = [];
  }

  openReturnFundDialog() {
    this.showReturnFundDialog = true;
    this.returnFundAmount = null;
    this.selectedReturnMethod = null;
    this.bankAccountNumber = '';
    this.vodafoneNumber = '';
  }

  closeReturnFundDialog() {
    this.showReturnFundDialog = false;
    this.returnFundAmount = null;
    this.selectedReturnMethod = null;
    this.bankAccountNumber = '';
    this.vodafoneNumber = '';
  }

  async returnFund() {
    if (!this.returnFundAmount || this.returnFundAmount <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Amount',
        detail: 'Please enter a valid amount greater than 0',
      });
      return;
    }

    if (!this.selectedReturnMethod) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select a return method',
      });
      return;
    }

    if (this.selectedReturnMethod === 'vodafone' && !this.vodafoneNumber) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please enter your Vodafone Cash number',
      });
      return;
    }

    if (this.selectedReturnMethod === 'bank' && !this.bankAccountNumber) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please enter your bank account number',
      });
      return;
    }

    if (this.returnFundAmount > this.balance) {
      this.messageService.add({
        severity: 'error',
        summary: 'Insufficient Balance',
        detail: 'The requested amount exceeds your current balance',
      });
      return;
    }

    this.isLoading = true;

    try {
      // Simulate API call to return funds
      await this.simulateReturnFund(this.returnFundAmount);

      // Update balance
      this.balance -= this.returnFundAmount;

      // Add transaction record
      const newTransaction: ITransaction = {
        id: Date.now(),
        type: 'debit',
        amount: this.returnFundAmount,
        description: `Fund Returned via ${
          this.selectedReturnMethod === 'vodafone'
            ? 'Vodafone Cash'
            : 'Bank Transfer'
        }`,
        date: new Date(),
        status: 'completed',
      };
      this.transactions.unshift(newTransaction);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `$${this.returnFundAmount.toFixed(
          2
        )} has been returned to your ${
          this.selectedReturnMethod === 'vodafone'
            ? 'Vodafone Cash account'
            : 'bank account'
        }`,
      });

      this.closeReturnFundDialog();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to return funds. Please try again.',
      });
    } finally {
      this.isLoading = false;
    }
  }

  private simulateReturnFund(amount: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Return failed'));
        }
      }, 2000);
    });
  }

  private simulateAddFund(amount: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Payment failed'));
        }
      }, 2000);
    });
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  openTermsAndConditions() {
    // In real app, this would navigate to terms page or open modal
    this.messageService.add({
      severity: 'info',
      summary: 'Navigation',
      detail: 'Opening Terms and Conditions...',
    });
  }

  openHelpSupport() {
    // In real app, this would navigate to help page or open support chat
    this.messageService.add({
      severity: 'info',
      summary: 'Navigation',
      detail: 'Opening Help & Support...',
    });
  }
}
