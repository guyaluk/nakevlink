import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '@/constants/categories';
import { createBusiness } from '@/lib/dataconnect';

interface BusinessFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  contactName: string;
  phoneNumber: string;
  address: string;
  categoryId: string;
  description: string;
  punchNum: string;
  expirationDays: string;
  businessImage: string; // base64 string
}

const SimpleBusinessSignup: React.FC = () => {
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    contactName: '',
    phoneNumber: '',
    address: '',
    categoryId: '',
    description: '',
    punchNum: '10',
    expirationDays: '30',
    businessImage: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    // Validate file type
    if (!file.type.includes('image/')) {
      setImageError('Please select a valid image file (JPG or PNG)');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        businessImage: base64String
      }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      businessImage: ''
    }));
    setImagePreview(null);
    setImageError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.businessName || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Create user account with business owner role
      const user = await signUp(formData.email, formData.password, {
        name: formData.name,
        role: 'business_owner'
      });
      
      // Save business data to database
      try {
        const businessId = await createBusiness({
          name: formData.businessName,
          contact_name: formData.contactName || undefined,
          phone_number: formData.phoneNumber || undefined,
          address: formData.address || undefined,
          category_id: parseInt(formData.categoryId),
          description: formData.description || undefined,
          punch_num: parseInt(formData.punchNum) || 10,
          expiration_duration_in_days: parseInt(formData.expirationDays) || 30,
          email: formData.email
        });
        
        console.log('Business created successfully:', {
          uid: user.uid,
          businessId: businessId,
          name: formData.name,
          businessName: formData.businessName
        });
      } catch (dbError) {
        console.error('Failed to save business data:', dbError);
        // Continue even if database save fails
      }
      
      // Navigate to business dashboard
      navigate('/business');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">NakevLink</h1>
          <p className="mt-2 text-muted-foreground">Create your business account</p>
        </div>

        {/* Signup Card */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link 
                to="/signup" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Business Owner Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Choose a password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Business Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      placeholder="Contact person name"
                      value={formData.contactName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Business phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Full business address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Business Category *</Label>
                  <Select value={formData.categoryId} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your business..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {/* Business Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="businessImage">Business Logo/Photo</Label>
                  <div className="space-y-3">
                    <Input
                      id="businessImage"
                      name="businessImage"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {imageError && (
                      <p className="text-sm text-destructive">{imageError}</p>
                    )}
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative w-32 h-32 mx-auto border-2 border-dashed border-primary/20 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Business logo preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    
                    {!imagePreview && (
                      <div className="w-32 h-32 mx-auto border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground">
                        <span className="text-sm text-center">
                          Upload Image<br/>
                          <span className="text-xs">(JPG/PNG, max 2MB)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="punchNum">Punches Required for Reward</Label>
                    <Input
                      id="punchNum"
                      name="punchNum"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.punchNum}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDays">Card Expiration (Days)</Label>
                    <Input
                      id="expirationDays"
                      name="expirationDays"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.expirationDays}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Creating Account...' : 'Create Business Account'}
              </Button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleBusinessSignup;