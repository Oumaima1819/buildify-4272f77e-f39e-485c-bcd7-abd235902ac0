
import { useState } from 'react';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Gift, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2
} from 'lucide-react';
import { Reward, UserReward } from '@/types';

const RewardCard = ({ 
  reward, 
  userPoints, 
  onRedeem 
}: { 
  reward: Reward, 
  userPoints: number,
  onRedeem: () => void 
}) => {
  const canRedeem = userPoints >= reward.points_required;
  
  return (
    <Card className={!canRedeem ? 'opacity-70' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="bg-amber-100 p-2 rounded-full">
            <Gift className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-right">
            <CardTitle className="text-lg">{reward.name}</CardTitle>
            <CardDescription className="text-right">{reward.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="font-medium text-blue-600">${reward.cash_value.toFixed(2)}</div>
          <div className="font-medium text-amber-600">{reward.points_required} نقطة</div>
        </div>
        
        {!canRedeem && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-amber-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (userPoints / reward.points_required) * 100)}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">
              تحتاج {reward.points_required - userPoints} نقطة إضافية
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={!canRedeem}
              variant={canRedeem ? "default" : "outline"}
            >
              {canRedeem ? 'استبدال المكافأة' : 'نقاط غير كافية'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-right">تأكيد استبدال المكافأة</DialogTitle>
              <DialogDescription className="text-right">
                أنت على وشك استبدال {reward.points_required} نقطة مقابل {reward.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup defaultValue="paypal" className="grid grid-cols-2 gap-4">
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                  <img src="/placeholder.svg" alt="PayPal" className="mb-3 h-8 w-8" />
                  <span className="text-sm font-medium">PayPal</span>
                </Label>
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <RadioGroupItem value="bank" id="bank" className="sr-only" />
                  <img src="/placeholder.svg" alt="Bank Transfer" className="mb-3 h-8 w-8" />
                  <span className="text-sm font-medium">تحويل بنكي</span>
                </Label>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="payment-email" className="text-right block">البريد الإلكتروني للدفع</Label>
                <Input
                  id="payment-email"
                  placeholder="أدخل بريدك الإلكتروني للدفع"
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onRedeem}>تأكيد الاستبدال</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const RedemptionHistoryItem = ({ redemption }: { redemption: UserReward }) => {
  const getStatusColor = () => {
    switch (redemption.status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'processing':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getStatusIcon = () => {
    switch (redemption.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getStatusText = () => {
    switch (redemption.status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'failed':
        return 'فشل';
      default:
        return redemption.status;
    }
  };
  
  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div className="flex items-center">
        {getStatusIcon()}
        <div className="ml-3">
          <p className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</p>
          <p className="text-xs text-gray-500">
            {new Date(redemption.created_at).toLocaleDateString('ar-MA')}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{redemption.reward?.name}</p>
        <p className="text-sm text-amber-600">-{redemption.points_spent} نقطة</p>
      </div>
    </div>
  );
};

const Rewards = () => {
  const { user } = useAuth();
  const { rewards, rewardsLoading, redeemedRewards, redeemReward, isRedeeming } = useRewards();
  const { toast } = useToast();
  const [redeemingRewardId, setRedeemingRewardId] = useState<number | null>(null);
  
  const handleRedeemReward = (rewardId: number) => {
    setRedeemingRewardId(rewardId);
    redeemReward(
      { 
        rewardId, 
        paymentMethod: 'paypal',
        paymentDetails: { email: user?.email }
      },
      {
        onSuccess: () => {
          toast({
            title: "تم طلب المكافأة بنجاح!",
            description: "سيتم معالجة طلبك في أقرب وقت ممكن.",
          });
          setRedeemingRewardId(null);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "فشل طلب المكافأة",
            description: error.message || "حدث خطأ أثناء طلب المكافأة. يرجى المحاولة مرة أخرى.",
          });
          setRedeemingRewardId(null);
        }
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold">المكافآت</h1>
          <p className="text-gray-500">استبدل نقاطك بمكافآت نقدية</p>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="bg-green-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-right">
                <CardTitle className="text-xl">رصيدك الحالي</CardTitle>
                <CardDescription className="text-right text-2xl font-bold text-green-600">
                  {user?.points} نقطة
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="available-rewards">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="available-rewards">المكافآت المتاحة</TabsTrigger>
            <TabsTrigger value="redemption-history">سجل الاستبدال</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available-rewards" className="space-y-4">
            {rewardsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards?.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    userPoints={user?.points || 0}
                    onRedeem={() => handleRedeemReward(reward.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="redemption-history">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-right">سجل الاستبدال</CardTitle>
                <CardDescription className="text-right">
                  تاريخ طلبات استبدال النقاط الخاصة بك
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redeemedRewards && redeemedRewards.length > 0 ? (
                  <div className="space-y-4">
                    {redeemedRewards.map((redemption) => (
                      <RedemptionHistoryItem key={redemption.id} redemption={redemption} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Gift className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">لم تقم باستبدال أي مكافآت بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;