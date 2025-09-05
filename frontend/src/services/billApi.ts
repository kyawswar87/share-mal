import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  BillDto, 
  BillCreateRequest, 
  BillUpdateRequest, 
  BillStatus, 
  ApiResponse,
  ErrorResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Utility function to extract error message from response
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const errorData = error.response.data as ErrorResponse;
    if (errorData.error?.message) {
      return errorData.error.message;
    }
  }
  return error.message || 'An unexpected error occurred';
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = extractErrorMessage(error);
    console.error('API Response Error:', errorMessage);
    
    // Create a new error with the extracted message
    const customError = new Error(errorMessage);
    return Promise.reject(customError);
  }
);

export class BillApiService {
  /**
   * Get all bills
   */
  static async getAllBills(): Promise<BillDto[]> {
    const response: AxiosResponse<ApiResponse<BillDto[]>> = await apiClient.get('/bills');
    return response.data.data;
  }

  /**
   * Get bill by ID
   */
  static async getBillById(id: number): Promise<BillDto> {
    const response: AxiosResponse<ApiResponse<BillDto>> = await apiClient.get(`/bills/${id}`);
    return response.data.data;
  }

  /**
   * Create new bill
   */
  static async createBill(billData: BillCreateRequest): Promise<BillDto> {
    const response: AxiosResponse<ApiResponse<BillDto>> = await apiClient.post('/bills', billData);
    return response.data.data;
  }

  /**
   * Update existing bill
   */
  static async updateBill(id: number, billData: BillUpdateRequest): Promise<BillDto> {
    const response: AxiosResponse<ApiResponse<BillDto>> = await apiClient.put(`/bills/${id}`, billData);
    return response.data.data;
  }

  /**
   * Delete bill
   */
  static async deleteBill(id: number): Promise<void> {
    await apiClient.delete(`/bills/${id}`);
  }

  /**
   * Get bills by status
   */
  static async getBillsByStatus(status: BillStatus): Promise<BillDto[]> {
    const response: AxiosResponse<ApiResponse<BillDto[]>> = await apiClient.get(`/bills/status/${status}`);
    return response.data.data;
  }

  /**
   * Search bills by title
   */
  static async searchBillsByTitle(title: string): Promise<BillDto[]> {
    const response: AxiosResponse<ApiResponse<BillDto[]>> = await apiClient.get('/bills/search', {
      params: { title }
    });
    return response.data.data;
  }

  /**
   * Pay bill for a specific person
   */
  static async payBill(billId: number, personId: number): Promise<BillDto> {
    const response: AxiosResponse<ApiResponse<BillDto>> = await apiClient.patch(`/bills/${billId}/pay`, null, {
      params: { personId }
    });
    return response.data.data;
  }

  /**
   * Update bill status based on person payment statuses
   */
  static async updateBillStatus(id: number): Promise<BillDto> {
    const response: AxiosResponse<ApiResponse<BillDto>> = await apiClient.put(`/bills/${id}/status`);
    return response.data.data;
  }
}

export default BillApiService;
