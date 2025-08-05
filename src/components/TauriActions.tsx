import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TauriService } from '@/lib/tauri';
import { useToast } from '@/hooks/use-toast';
import { 
  FolderOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  projectFolder?: string;
}

export const TauriActions = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    projectFolder: ''
  });
  const [emailDialog, setEmailDialog] = useState({ open: false, subject: '', body: '' });
  const { toast } = useToast();

  const handleSelectFolder = async () => {
    if (!TauriService.isDesktop()) {
      toast({
        title: "תכונה לא זמינה",
        description: "תכונה זו זמינה רק באפליקציה המותקנת",
        variant: "destructive"
      });
      return;
    }

    try {
      const folder = await TauriService.selectFolder();
      if (folder) {
        setSelectedFolder(folder);
        setContactInfo(prev => ({ ...prev, projectFolder: folder }));
        toast({
          title: "תיקייה נבחרה",
          description: `נבחרה: ${folder}`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לבחור תיקייה",
        variant: "destructive"
      });
    }
  };

  const handleOpenFolder = async (path?: string) => {
    const folderPath = path || selectedFolder || contactInfo.projectFolder;
    if (!folderPath) {
      toast({
        title: "שגיאה",
        description: "אנא בחר תיקייה תחילה",
        variant: "destructive"
      });
      return;
    }

    if (!TauriService.isDesktop()) {
      toast({
        title: "תכונה לא זמינה",
        description: "תכונה זו זמינה רק באפליקציה המותקנת",
        variant: "destructive"
      });
      return;
    }

    try {
      await TauriService.openFolder(folderPath);
      toast({
        title: "תיקייה נפתחה",
        description: `נפתחה ב-Finder: ${folderPath}`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתוח את התיקייה",
        variant: "destructive"
      });
    }
  };

  const handleOpenWhatsApp = async () => {
    if (!contactInfo.phone) {
      toast({
        title: "שגיאה",
        description: "אנא הזן מספר טלפון",
        variant: "destructive"
      });
      return;
    }

    if (!TauriService.validatePhone(contactInfo.phone)) {
      toast({
        title: "שגיאה",
        description: "מספר טלפון לא תקין",
        variant: "destructive"
      });
      return;
    }

    try {
      await TauriService.openWhatsApp(contactInfo.phone);
      toast({
        title: "WhatsApp נפתח",
        description: `פתיחת צ׳אט עם ${TauriService.formatPhoneNumber(contactInfo.phone)}`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתוח WhatsApp",
        variant: "destructive"
      });
    }
  };

  const handleOpenEmail = async () => {
    if (!contactInfo.email) {
      toast({
        title: "שגיאה",
        description: "אנא הזן כתובת מייל",
        variant: "destructive"
      });
      return;
    }

    if (!TauriService.validateEmail(contactInfo.email)) {
      toast({
        title: "שגיאה",
        description: "כתובת מייל לא תקינה",
        variant: "destructive"
      });
      return;
    }

    try {
      await TauriService.openEmail(
        contactInfo.email, 
        emailDialog.subject || `פרויקט: ${contactInfo.name}`,
        emailDialog.body
      );
      toast({
        title: "מייל נפתח",
        description: `פתיחת מייל ל-${contactInfo.email}`,
      });
      setEmailDialog({ open: false, subject: '', body: '' });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתוח מייל",
        variant: "destructive"
      });
    }
  };

  const handleDialPhone = async () => {
    if (!contactInfo.phone) {
      toast({
        title: "שגיאה",
        description: "אנא הזן מספר טלפון",
        variant: "destructive"
      });
      return;
    }

    if (!TauriService.validatePhone(contactInfo.phone)) {
      toast({
        title: "שגיאה",
        description: "מספר טלפון לא תקין",
        variant: "destructive"
      });
      return;
    }

    try {
      await TauriService.dialPhone(contactInfo.phone);
      toast({
        title: "חיוג מתחיל",
        description: `חיוג ל-${TauriService.formatPhoneNumber(contactInfo.phone)}`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להתחיל חיוג",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="apple-card">
      <CardHeader>
        <CardTitle className="apple-title apple-flex">
          <ExternalLink className="h-5 w-5" />
          פעולות מערכת
        </CardTitle>
      </CardHeader>
      <CardContent className="apple-spacing">
        {/* Contact Information */}
        <div className="apple-grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="contact-name" className="apple-subtitle">שם איש קשר</Label>
            <Input
              id="contact-name"
              value={contactInfo.name}
              onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="הזן שם איש קשר"
              className="apple-input"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-email" className="apple-subtitle">כתובת מייל</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="apple-input"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-phone" className="apple-subtitle">מספר טלפון</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="050-123-4567"
              className="apple-input"
            />
          </div>
        </div>

        {/* Folder Selection */}
        <div className="apple-spacing">
          <Label className="apple-subtitle">תיקיית פרויקט</Label>
          <div className="apple-flex">
            <Button
              onClick={handleSelectFolder}
              variant="outline"
              className="apple-button apple-hover"
            >
              <FolderOpen className="h-4 w-4 ml-2" />
              בחר תיקייה
            </Button>
            {(selectedFolder || contactInfo.projectFolder) && (
              <Button
                onClick={() => handleOpenFolder()}
                variant="outline"
                className="apple-button apple-hover"
              >
                פתח ב-Finder
              </Button>
            )}
          </div>
          {(selectedFolder || contactInfo.projectFolder) && (
            <p className="apple-body text-xs text-muted-foreground mt-2">
              {selectedFolder || contactInfo.projectFolder}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="apple-grid grid-cols-2 gap-4">
          <Button
            onClick={handleOpenWhatsApp}
            disabled={!contactInfo.phone}
            className="apple-button-primary apple-hover"
          >
            <MessageCircle className="h-4 w-4 ml-2" />
            WhatsApp
          </Button>

          <Dialog open={emailDialog.open} onOpenChange={(open) => setEmailDialog(prev => ({ ...prev, open }))}>
            <DialogTrigger asChild>
              <Button
                disabled={!contactInfo.email}
                variant="outline"
                className="apple-button apple-hover"
              >
                <Mail className="h-4 w-4 ml-2" />
                מייל
              </Button>
            </DialogTrigger>
            <DialogContent className="apple-card">
              <DialogHeader>
                <DialogTitle className="apple-title">שלח מייל</DialogTitle>
              </DialogHeader>
              <div className="apple-spacing">
                <div>
                  <Label htmlFor="email-subject" className="apple-subtitle">נושא</Label>
                  <Input
                    id="email-subject"
                    value={emailDialog.subject}
                    onChange={(e) => setEmailDialog(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder={`פרויקט: ${contactInfo.name}`}
                    className="apple-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email-body" className="apple-subtitle">תוכן ההודעה</Label>
                  <Textarea
                    id="email-body"
                    value={emailDialog.body}
                    onChange={(e) => setEmailDialog(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="הזן את תוכן ההודעה..."
                    className="apple-input min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleOpenEmail}
                  className="apple-button-primary apple-hover w-full"
                >
                  פתח מייל
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleDialPhone}
            disabled={!contactInfo.phone}
            variant="outline"
            className="apple-button apple-hover"
          >
            <Phone className="h-4 w-4 ml-2" />
            חיוג
          </Button>

          <Button
            onClick={() => handleOpenFolder(contactInfo.projectFolder)}
            disabled={!contactInfo.projectFolder}
            variant="outline"
            className="apple-button apple-hover"
          >
            <Smartphone className="h-4 w-4 ml-2" />
            פתח תיקייה
          </Button>
        </div>

        {!TauriService.isDesktop() && (
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <p className="apple-body text-sm text-muted-foreground text-center">
              💡 לשימוש מלא בתכונות המערכת, הורד את האפליקציה המותקנת
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};