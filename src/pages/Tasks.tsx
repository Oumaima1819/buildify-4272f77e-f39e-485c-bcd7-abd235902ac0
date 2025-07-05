
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  GamepadIcon, 
  Video, 
  ClipboardList, 
  CalendarCheck, 
  Clock, 
  Award,
  Loader2
} from 'lucide-react';
import { TaskCategory } from '@/types';

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case 'game-controller':
      return <GamepadIcon className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'clipboard-list':
      return <ClipboardList className="h-5 w-5" />;
    case 'calendar-check':
      return <CalendarCheck className="h-5 w-5" />;
    default:
      return <Award className="h-5 w-5" />;
  }
};

const TaskCard = ({ 
  task, 
  onComplete, 
  isCompleting 
}: { 
  task: any, 
  onComplete: () => void, 
  isCompleting: boolean 
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.duration_seconds);
  const { toast } = useToast();

  const handleStart = () => {
    setIsStarted(true);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Simulate task completion after duration
    setTimeout(() => {
      clearInterval(timer);
      setIsStarted(false);
      setTimeLeft(task.duration_seconds);
      onComplete();
      toast({
        title: "تم إكمال المهمة!",
        description: `لقد ربحت ${task.points} نقطة من هذه المهمة.`,
      });
    }, task.duration_seconds * 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="bg-green-100 p-2 rounded-full">
            {getCategoryIcon(task.category?.icon || '')}
          </div>
          <div className="text-right">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="text-right">{task.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{formatTime(task.duration_seconds)}</span>
          </div>
          <div className="font-medium text-green-600">+{task.points} نقطة</div>
        </div>
        
        {isStarted && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(1 - timeLeft / task.duration_seconds) * 100}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm">{formatTime(timeLeft)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={isStarted ? undefined : handleStart}
          disabled={isStarted || isCompleting}
        >
          {isCompleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري التحميل...
            </>
          ) : isStarted ? (
            'جاري التنفيذ...'
          ) : (
            'بدء المهمة'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Tasks = () => {
  const { tasks, tasksLoading, completeTask, isCompletingTask } = useTasks();
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  
  const handleCompleteTask = (taskId: number) => {
    setCompletingTaskId(taskId);
    completeTask(taskId, {
      onSuccess: () => {
        setCompletingTaskId(null);
      },
      onError: () => {
        setCompletingTaskId(null);
      }
    });
  };
  
  // Group tasks by category
  const tasksByCategory = tasks?.reduce((acc, task) => {
    const categoryId = task.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(task);
    return acc;
  }, {} as Record<number, typeof tasks>);
  
  // Get unique categories
  const categories = tasks?.reduce((acc, task) => {
    if (task.category && !acc.some(c => c.id === task.category_id)) {
      acc.push({
        id: task.category_id,
        name: task.category.name,
        icon: task.category.icon,
        description: task.category.description
      });
    }
    return acc;
  }, [] as TaskCategory[]);

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold">المهام المتاحة</h1>
          <p className="text-gray-500">أكمل المهام واربح النقاط</p>
        </div>
        
        {tasksLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <Tabs defaultValue={categories?.[0]?.id.toString()}>
            <TabsList className="grid grid-cols-4 mb-4">
              {categories?.map((category) => (
                <TabsTrigger key={category.id} value={category.id.toString()} className="flex items-center gap-1">
                  {getCategoryIcon(category.icon)}
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories?.map((category) => (
              <TabsContent key={category.id} value={category.id.toString()} className="space-y-4">
                <div className="text-right mb-4">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="text-gray-500">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasksByCategory?.[category.id]?.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onComplete={() => handleCompleteTask(task.id)}
                      isCompleting={isCompletingTask && completingTaskId === task.id}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Tasks;