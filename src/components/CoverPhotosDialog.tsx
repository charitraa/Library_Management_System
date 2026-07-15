import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Trash2, Upload } from "lucide-react";
import { resUrl } from "@/api/entities";
import {
  useCoverPhotos,
  useDeleteCoverPhoto,
  useMarkProfilePhoto,
  useUploadCoverPhotos,
} from "@/hooks/api/use-cover-photos";
import { useToast } from "@/hooks/use-toast";

interface CoverPhotosDialogProps {
  bookInfoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CoverPhotosDialog({ bookInfoId, open, onOpenChange }: CoverPhotosDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: photos, isLoading } = useCoverPhotos(open ? bookInfoId : undefined);
  const { mutate: upload, isPending: isUploading } = useUploadCoverPhotos(() =>
    toast({ title: "Photos uploaded" }),
  );
  const { mutate: deletePhoto } = useDeleteCoverPhoto(() => toast({ title: "Photo deleted" }));
  const { mutate: markProfile } = useMarkProfilePhoto(() => toast({ title: "Set as cover photo" }));

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("coverPhotos", file));
    upload(
      { bookInfoId, formData },
      {
        onError: (err) =>
          toast({
            title: "Upload failed",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cover Photos</DialogTitle>
          <DialogDescription>Manage cover and gallery images for this title.</DialogDescription>
        </DialogHeader>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Images
        </Button>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (photos ?? []).length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto py-2">
            {(photos ?? []).map((photo) => (
              <div key={photo.bookImageId} className="relative group rounded-md overflow-hidden border aspect-[3/4]">
                <img src={resUrl(photo.imageUrl)} alt="" className="h-full w-full object-cover" />
                {photo.isProfile && (
                  <div className="absolute top-1 left-1 rounded-full bg-primary p-1">
                    <Star className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!photo.isProfile && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                      title="Set as cover"
                      onClick={() => markProfile(photo.bookImageId)}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7"
                    title="Delete"
                    onClick={() => deletePhoto(photo.bookImageId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
