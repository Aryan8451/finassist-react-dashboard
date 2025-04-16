
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  generateMockTransactions, 
  Transaction,
  TransactionType,
  TransactionCategory 
} from '@/services/mockData';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeftRight, 
  CalendarIcon, 
  ChevronLeft, 
  Download, 
  Edit, 
  Filter, 
  Plus, 
  Search, 
  Trash2, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'expense' as TransactionType,
    category: 'food' as TransactionCategory,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  // Load transactions on mount
  useEffect(() => {
    if (user) {
      const mockTransactions = generateMockTransactions(user.id);
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    }
  }, [user]);
  
  // Apply filters when filter or search query changes
  useEffect(() => {
    if (transactions.length > 0) {
      let filtered = [...transactions];
      
      // Apply type filter
      if (filter !== 'all') {
        filtered = filtered.filter(t => t.type === filter);
      }
      
      // Apply search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
        );
      }
      
      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFilteredTransactions(filtered);
    }
  }, [filter, searchQuery, transactions]);
  
  // Handle form input changes for new/edit transaction
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: 'new' | 'edit'
  ) => {
    const { name, value } = e.target;
    
    if (form === 'new') {
      setNewTransaction({
        ...newTransaction,
        [name]: name === 'amount' ? value : value,
      });
    } else if (editingTransaction) {
      setEditingTransaction({
        ...editingTransaction,
        [name]: name === 'amount' ? parseFloat(value) : value,
      });
    }
  };
  
  // Handle select changes for new/edit transaction
  const handleSelectChange = (
    value: string, 
    name: 'type' | 'category',
    form: 'new' | 'edit'
  ) => {
    if (form === 'new') {
      setNewTransaction({
        ...newTransaction,
        [name]: value,
      });
    } else if (editingTransaction) {
      setEditingTransaction({
        ...editingTransaction,
        [name]: value,
      });
    }
  };
  
  // Add new transaction
  const handleAddTransaction = () => {
    const newTrans: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      userId: user!.id,
    };
    
    setTransactions([...transactions, newTrans]);
    
    // Reset form
    setNewTransaction({
      amount: '',
      type: 'expense',
      category: 'food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    setIsAddDialogOpen(false);
  };
  
  // Update existing transaction
  const handleUpdateTransaction = () => {
    if (editingTransaction) {
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? editingTransaction : t
      );
      
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      setIsEditDialogOpen(false);
    }
  };
  
  // Delete transaction
  const handleDeleteTransaction = () => {
    if (editingTransaction) {
      const updatedTransactions = transactions.filter(t => t.id !== editingTransaction.id);
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Get transaction type icon
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'expense':
        return <TrendingDown className="h-5 w-5 text-warning" />;
      case 'investment':
        return <ArrowLeftRight className="h-5 w-5 text-info" />;
      default:
        return null;
    }
  };
  
  // Get category options based on transaction type
  const getCategoryOptions = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return ['salary', 'dividend', 'gift'].map(cat => (
          <SelectItem key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </SelectItem>
        ));
      case 'expense':
        return ['food', 'transportation', 'utilities', 'entertainment', 'housing', 'healthcare', 'other'].map(cat => (
          <SelectItem key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </SelectItem>
        ));
      case 'investment':
        return ['stocks', 'bonds', 'realEstate', 'crypto'].map(cat => (
          <SelectItem key={cat} value={cat}>
            {cat === 'realEstate' ? 'Real Estate' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </SelectItem>
        ));
      default:
        return [];
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Transactions</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
            {/* Search bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter by type */}
            <div className="flex items-center bg-accent/50 rounded-md p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-background shadow-sm' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-3 py-1 rounded text-sm ${filter === 'income' ? 'bg-background shadow-sm' : ''}`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-3 py-1 rounded text-sm ${filter === 'expense' ? 'bg-background shadow-sm' : ''}`}
              >
                Expenses
              </button>
              <button
                onClick={() => setFilter('investment')}
                className={`px-3 py-1 rounded text-sm ${filter === 'investment' ? 'bg-background shadow-sm' : ''}`}
              >
                Investments
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => handleInputChange(e, 'new')}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value) => handleSelectChange(value, 'type', 'new')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => handleSelectChange(value, 'category', 'new')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategoryOptions(newTransaction.type)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={newTransaction.description}
                        onChange={(e) => handleInputChange(e, 'new')}
                        placeholder="Transaction description"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => handleInputChange(e, 'new')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction} disabled={!newTransaction.amount || !newTransaction.description}>
                    Add Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Transactions Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span>{transaction.description}</span>
                    </TableCell>
                    <TableCell className="capitalize">{transaction.category}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.type === 'income' ? 'text-success' :
                      transaction.type === 'expense' ? 'text-warning' :
                      'text-info'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No transactions found. Try changing your filters or add a new transaction.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Edit Transaction Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Update the details of your transaction.
              </DialogDescription>
            </DialogHeader>
            {editingTransaction && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <Label htmlFor="edit-amount">Amount ($)</Label>
                    <Input
                      id="edit-amount"
                      name="amount"
                      type="number"
                      value={editingTransaction.amount}
                      onChange={(e) => handleInputChange(e, 'edit')}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select
                      value={editingTransaction.type}
                      onValueChange={(value) => handleSelectChange(value, 'type', 'edit')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editingTransaction.category}
                      onValueChange={(value) => handleSelectChange(value, 'category', 'edit')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions(editingTransaction.type)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      value={editingTransaction.description}
                      onChange={(e) => handleInputChange(e, 'edit')}
                      placeholder="Transaction description"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="edit-date">Date</Label>
                    <div className="relative">
                      <Input
                        id="edit-date"
                        name="date"
                        type="date"
                        value={editingTransaction.date.split('T')[0]}
                        onChange={(e) => handleInputChange(e, 'edit')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTransaction} 
                disabled={!editingTransaction?.amount || !editingTransaction?.description}
              >
                Update Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Transaction Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {editingTransaction && (
              <div className="py-4">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p><strong>Description:</strong> {editingTransaction.description}</p>
                  <p><strong>Amount:</strong> ${editingTransaction.amount.toLocaleString()}</p>
                  <p><strong>Date:</strong> {new Date(editingTransaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteTransaction}>
                Delete Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Transactions;
