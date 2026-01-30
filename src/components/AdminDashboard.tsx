import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Image as ImageIcon,
  LayoutGrid,
  Lock,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useId, useState } from "react";
import type { ImageRecord } from "../lib/imageStore";
import type { Settings } from "../lib/settingsStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AdminDashboardProps {
  images: ImageRecord[];
  settings: Settings;
}

export default function AdminDashboard({
  images,
  settings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("images");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const fileInputId = useId();
  const passwordInputId = useId();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner shadow-primary/20">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Photo Grid
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={activeTab === "images" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("images")}
              className="h-9 px-4 rounded-full transition-all"
            >
              Gallery
            </Button>
            <Button
              variant={activeTab === "upload" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("upload")}
              className="h-9 px-4 rounded-full transition-all"
            >
              Upload
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("settings")}
              className="h-9 px-4 rounded-full transition-all"
            >
              Settings
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 rounded-full border-white/10 hover:bg-white/5 hover:text-white hidden sm:flex"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Site{" "}
                <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="flex items-center justify-around p-2 rounded-full bg-zinc-900/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50">
          <Button
            variant={activeTab === "images" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActiveTab("images")}
            className="rounded-full w-10 h-10"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "upload" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActiveTab("upload")}
            className="rounded-full w-10 h-10"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActiveTab("settings")}
            className="rounded-full w-10 h-10"
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <main className="container mx-auto py-10 px-4 sm:px-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Gallery
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and organize your portfolio.
                </p>
              </div>
              <Badge
                variant="outline"
                className="h-7 px-3 rounded-full border-primary/20 bg-primary/5 text-primary"
              >
                {images.length} Items
              </Badge>
            </div>

            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                <div className="rounded-full bg-white/5 p-6 mb-6">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Gallery is empty
                </h3>
                <p className="text-muted-foreground max-w-xs mt-2 mb-8">
                  Upload your first photos to get started with your portfolio.
                </p>
                <Button
                  onClick={() => setActiveTab("upload")}
                  size="lg"
                  className="rounded-full px-8"
                >
                  Upload Images
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                      <img
                        src={img.src}
                        alt={img.id}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-white">
                          {img.width} × {img.height}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2">
                          <form method="POST" className="contents">
                            <input type="hidden" name="action" value="moveUp" />
                            <input type="hidden" name="id" value={img.id} />
                            <Button
                              type="submit"
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white"
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          </form>
                          <form method="POST" className="contents">
                            <input
                              type="hidden"
                              name="action"
                              value="moveDown"
                            />
                            <input type="hidden" name="id" value={img.id} />
                            <Button
                              type="submit"
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white"
                              disabled={index === images.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>

                        <form method="POST" className="contents">
                          <input type="hidden" name="action" value="delete" />
                          <input type="hidden" name="id" value={img.id} />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Upload Media
              </h1>
              <p className="text-muted-foreground mt-2">
                Add new high-resolution images to your grid.
              </p>
            </div>

            <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <form
                  method="POST"
                  encType="multipart/form-data"
                  className="space-y-6"
                >
                  <input type="hidden" name="action" value="upload" />

                  <div className="group relative flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/10 hover:border-primary/50 bg-black/20 hover:bg-primary/5 transition-all duration-500 cursor-pointer">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="z-10 flex flex-col items-center p-8 text-center space-y-4">
                      <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-2xl ring-1 ring-border group-hover:scale-110 transition-transform duration-500">
                        <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <Label
                        htmlFor={fileInputId}
                        className="cursor-pointer text-center space-y-2"
                      >
                        <span className="text-2xl font-bold block text-foreground">
                          {uploadFiles && uploadFiles.length > 0
                            ? `${uploadFiles.length} file${uploadFiles.length !== 1 ? "s" : ""} selected`
                            : "Drag & drop or click"}
                        </span>
                        <span className="text-sm text-muted-foreground block">
                          Supports high-res JPG, PNG, WebP
                        </span>
                        <Input
                          id={fileInputId}
                          name="file"
                          type="file"
                          multiple
                          accept="image/*"
                          required
                          className="hidden"
                          onChange={(e) => {
                            setUploadFiles(e.target.files);
                          }}
                        />
                      </Label>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30 border-t border-border flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {uploadFiles ? "Ready to upload" : "No files selected"}
                    </span>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!uploadFiles || uploadFiles.length === 0}
                      className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                    >
                      Start Upload
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1fr,300px]">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure layout and security.
                </p>
              </div>

              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Gallery Layout</CardTitle>
                  <CardDescription>
                    Control the algorithm that generates the justified grid.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form method="POST" className="space-y-6">
                    <input type="hidden" name="action" value="updateGallery" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Row Height Target</Label>
                        <div className="relative">
                          <Input
                            name="minHeight"
                            type="number"
                            defaultValue={settings.gallery.minHeight}
                            className="pl-4"
                            required
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Image Gap</Label>
                        <div className="relative">
                          <Input
                            name="gap"
                            type="number"
                            defaultValue={settings.gallery.gap}
                            className="pl-4"
                            required
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Large Image Height</Label>
                        <div className="relative">
                          <Input
                            name="largeImageMinHeight"
                            type="number"
                            defaultValue={settings.gallery.largeImageMinHeight}
                            className="pl-4"
                            required
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Wide Threshold</Label>
                        <Input
                          name="wideAspectRatioThreshold"
                          type="number"
                          step="0.1"
                          defaultValue={
                            settings.gallery.wideAspectRatioThreshold
                          }
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full rounded-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-primary">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <form method="POST" className="space-y-4">
                    <input type="hidden" name="action" value="updatePassword" />
                    <div className="space-y-2">
                      <Label htmlFor={passwordInputId}>New Password</Label>
                      <Input
                        id={passwordInputId}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full rounded-full"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Version</span>
                    <span className="font-mono">v1.2.0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-mono">Local JSON</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
