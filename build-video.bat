@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "ROOT=%~dp0"
set "IMG=%ROOT%..\صور"
set "OUT=%ROOT%دعوة-زفاف-انس-وشهد.mp4"
set "AUDIO=%IMG%\WhatsApp Audio 2026-07-12 at 5.35.28 PM.mp4"
set "TMP=%ROOT%_build"

where ffmpeg >nul 2>&1
if errorlevel 1 (
  echo FFmpeg غير مثبت. افتحي index.html في المتصفح لتشغيل الدعوة.
  exit /b 1
)

if exist "%TMP%" rmdir /s /q "%TMP%"
mkdir "%TMP%"

echo جاري إنشاء شرائح الفيديو...

ffmpeg -y -loop 1 -t 6 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.11 AM.jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\01.mp4"

ffmpeg -y -loop 1 -t 5.5 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.15 AM (1).jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\02.mp4"

ffmpeg -y -loop 1 -t 5.5 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.15 AM.jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\03.mp4"

ffmpeg -y -loop 1 -t 6 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.16 AM (3).jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\04.mp4"

ffmpeg -y -loop 1 -t 8 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.14 AM.jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\05.mp4"

ffmpeg -y -loop 1 -t 6 -i "%IMG%\WhatsApp Image 2026-07-12 at 10.57.16 AM (1).jpeg" ^
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" ^
  -c:v libx264 -pix_fmt yuv420p -r 30 "%TMP%\06.mp4"

(
echo file '01.mp4'
echo file '02.mp4'
echo file '03.mp4'
echo file '04.mp4'
echo file '05.mp4'
echo file '06.mp4'
) > "%TMP%\list.txt"

ffmpeg -y -f concat -safe 0 -i "%TMP%\list.txt" -c copy "%TMP%\video.mp4"

ffmpeg -y -ss 28 -i "%AUDIO%" -i "%TMP%\video.mp4" ^
  -map 1:v:0 -map 0:a:0 -c:v copy -c:a aac -b:a 192k -shortest "%OUT%"

echo.
echo تم إنشاء الفيديو: %OUT%
echo ملاحظة: النصوص العربية تظهر بشكل أفضل في index.html

endlocal
