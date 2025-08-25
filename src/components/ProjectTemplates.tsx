import React, { useState } from 'react';
import { Task, TaskItem } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  ShoppingCart, 
  BookOpen,
  Building,
  Camera,
  PenTool,
  Code,
  Search,
  Plus,
  Sparkles
} from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  price: number;
  currency: string;
  priority: 'low' | 'medium' | 'high';
  tasks: Omit<TaskItem, 'id'>[];
  color: string;
}

const templates: ProjectTemplate[] = [
  {
    id: 'website-business',
    name: 'אתר עסקי',
    description: 'אתר אינטרנט מקצועי לעסק עם דפי נחיתה ותוכן מותאם',
    icon: <Globe className="h-5 w-5" />,
    category: 'פיתוח',
    price: 2500,
    currency: 'USD',
    priority: 'medium',
    color: 'bg-blue-500',
    tasks: [
      { text: 'פגישה עם הלקוח לאיסוף דרישות', isCompleted: false },
      { text: 'יצירת wireframes ועיצוב ראשוני', isCompleted: false },
      { text: 'פיתוח דף הבית', isCompleted: false },
      { text: 'פיתוח דף אודות', isCompleted: false },
      { text: 'פיתוח דף שירותים', isCompleted: false },
      { text: 'פיתוח דף יצירת קשר', isCompleted: false },
      { text: 'אופטימיזציה למובייל', isCompleted: false },
      { text: 'בדיקות ותיקונים', isCompleted: false },
      { text: 'העלאה לשרת והפעלה', isCompleted: false },
      { text: 'הדרכת לקוח', isCompleted: false }
    ]
  },
  {
    id: 'mobile-app',
    name: 'אפליקציית מובייל',
    description: 'אפליקציה מותאמת אישית לאנדרואיד ו-iOS',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'פיתוח',
    price: 5000,
    currency: 'USD',
    priority: 'high',
    color: 'bg-green-500',
    tasks: [
      { text: 'תכנון UX/UI', isCompleted: false },
      { text: 'יצירת מוקאפים', isCompleted: false },
      { text: 'הקמת פרויקט React Native', isCompleted: false },
      { text: 'פיתוח מסכים ראשיים', isCompleted: false },
      { text: 'אינטגרציה עם API', isCompleted: false },
      { text: 'בדיקות על מכשירים', isCompleted: false },
      { text: 'אופטימיזציה לביצועים', isCompleted: false },
      { text: 'הכנה לפרסום בחנויות', isCompleted: false },
      { text: 'פרסום ב-App Store', isCompleted: false },
      { text: 'פרסום ב-Google Play', isCompleted: false }
    ]
  },
  {
    id: 'branding-package',
    name: 'חבילת מיתוג',
    description: 'עיצוב לוגו, זהות ויזואלית וחומרי שיווק',
    icon: <Palette className="h-5 w-5" />,
    category: 'עיצוב',
    price: 1500,
    currency: 'USD',
    priority: 'medium',
    color: 'bg-purple-500',
    tasks: [
      { text: 'מחקר ואיסוף השראה', isCompleted: false },
      { text: 'יצירת קונספטים ללוגו', isCompleted: false },
      { text: 'עיצוב לוגו סופי', isCompleted: false },
      { text: 'פיתוח פלטת צבעים', isCompleted: false },
      { text: 'בחירת טיפוגרפיה', isCompleted: false },
      { text: 'עיצוב כרטיס ביקור', isCompleted: false },
      { text: 'עיצוב נייר מכתבים', isCompleted: false },
      { text: 'יצירת מדריך מיתוג', isCompleted: false },
      { text: 'הכנת קבצים לדפוס', isCompleted: false },
      { text: 'מסירה ללקוח', isCompleted: false }
    ]
  },
  {
    id: 'ecommerce-store',
    name: 'חנות אונליין',
    description: 'חנות מקוונת מלאה עם מערכת תשלומים ומלאי',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'פיתוח',
    price: 4000,
    currency: 'USD',
    priority: 'high',
    color: 'bg-orange-500',
    tasks: [
      { text: 'תכנון ארכיטקטורת החנות', isCompleted: false },
      { text: 'עיצוב דפי המוצרים', isCompleted: false },
      { text: 'פיתוח מערכת מלאי', isCompleted: false },
      { text: 'אינטגרציה עם מערכת תשלומים', isCompleted: false },
      { text: 'פיתוח עגלת קניות', isCompleted: false },
      { text: 'מערכת ניהול הזמנות', isCompleted: false },
      { text: 'פאנל ניהול למנהל', isCompleted: false },
      { text: 'בדיקות תהליכי רכישה', isCompleted: false },
      { text: 'אופטימיזציה לקידום', isCompleted: false },
      { text: 'הדרכה ומסירה', isCompleted: false }
    ]
  },
  {
    id: 'content-writing',
    name: 'כתיבת תוכן',
    description: 'כתיבת תוכן מקצועי לאתרים ובלוגים',
    icon: <BookOpen className="h-5 w-5" />,
    category: 'תוכן',
    price: 800,
    currency: 'USD',
    priority: 'low',
    color: 'bg-indigo-500',
    tasks: [
      { text: 'מחקר נושא ומילות מפתח', isCompleted: false },
      { text: 'יצירת מתאר תוכן', isCompleted: false },
      { text: 'כתיבת טיוטה ראשונה', isCompleted: false },
      { text: 'עריכה ושיפור', isCompleted: false },
      { text: 'אופטימיזציה ל-SEO', isCompleted: false },
      { text: 'הוספת קישורים פנימיים', isCompleted: false },
      { text: 'בחירת תמונות רלוונטיות', isCompleted: false },
      { text: 'עריכה לשונית סופית', isCompleted: false },
      { text: 'פרסום או מסירה ללקוח', isCompleted: false }
    ]
  },
  {
    id: 'corporate-identity',
    name: 'זהות תאגידית',
    description: 'פיתוח זהות ויזואלית מקיפה לחברות',
    icon: <Building className="h-5 w-5" />,
    category: 'עיצוב',
    price: 3500,
    currency: 'USD',
    priority: 'medium',
    color: 'bg-gray-500',
    tasks: [
      { text: 'מחקר שוק ומתחרים', isCompleted: false },
      { text: 'הגדרת אישיות המותג', isCompleted: false },
      { text: 'עיצוב לוגו וסימן מסחרי', isCompleted: false },
      { text: 'פיתוח מערכת צבעים', isCompleted: false },
      { text: 'בחירת גופנים מותאמים', isCompleted: false },
      { text: 'עיצוב חומרי משרד', isCompleted: false },
      { text: 'תבניות מצגות', isCompleted: false },
      { text: 'עיצוב חתימת מייל', isCompleted: false },
      { text: 'מדריך זהות מפורט', isCompleted: false },
      { text: 'הדרכת צוות הלקוח', isCompleted: false }
    ]
  }
];

interface ProjectTemplatesProps {
  onCreateFromTemplate: (template: ProjectTemplate, customData: any) => void;
}

export const ProjectTemplates = ({ onCreateFromTemplate }: ProjectTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [customData, setCustomData] = useState({
    clientName: '',
    customPrice: '',
    customDescription: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProject = () => {
    if (selectedTemplate && customData.clientName) {
      onCreateFromTemplate(selectedTemplate, customData);
      setSelectedTemplate(null);
      setCustomData({ clientName: '', customPrice: '', customDescription: '' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="apple-button">
          <Sparkles className="h-4 w-4 ml-2" />
          תבניות פרויקט
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            תבניות פרויקטים
          </DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש תבניות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'הכל' : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.color} text-white`}>
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        ${template.price.toLocaleString()}
                      </span>
                      <Badge 
                        variant={template.priority === 'high' ? 'destructive' : 
                                template.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {template.priority === 'high' ? 'גבוהה' :
                         template.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {template.tasks.length} משימות
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">לא נמצאו תבניות התואמות לחיפוש</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Template Details */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${selectedTemplate.color} text-white`}>
                {selectedTemplate.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedTemplate.name}</h3>
                <p className="text-muted-foreground mb-2">{selectedTemplate.description}</p>
                <div className="flex items-center gap-4">
                  <Badge>{selectedTemplate.category}</Badge>
                  <span className="font-bold text-primary">
                    ${selectedTemplate.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {selectedTemplate.tasks.length} משימות
                  </span>
                </div>
              </div>
            </div>

            {/* Tasks Preview */}
            <div>
              <h4 className="font-medium mb-3">משימות כלולות:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedTemplate.tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border rounded-sm"></div>
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customization Form */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">התאמה אישית:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">שם הלקוח *</Label>
                  <Input
                    id="clientName"
                    value={customData.clientName}
                    onChange={(e) => setCustomData(prev => ({
                      ...prev,
                      clientName: e.target.value
                    }))}
                    placeholder="הכנס שם לקוח"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customPrice">מחיר מותאם (אופציונלי)</Label>
                  <Input
                    id="customPrice"
                    type="number"
                    value={customData.customPrice}
                    onChange={(e) => setCustomData(prev => ({
                      ...prev,
                      customPrice: e.target.value
                    }))}
                    placeholder={selectedTemplate.price.toString()}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customDescription">תיאור מותאם (אופציונלי)</Label>
                <Input
                  id="customDescription"
                  value={customData.customDescription}
                  onChange={(e) => setCustomData(prev => ({
                    ...prev,
                    customDescription: e.target.value
                  }))}
                  placeholder="תיאור נוסף או שינויים נדרשים"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                חזור
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={!customData.clientName}
              >
                <Plus className="h-4 w-4 ml-2" />
                צור פרויקט
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};