; Console Repair Atlas — Windows installer (NSIS 3)
; Built by tools/build.sh:  makensis -DVERSION=x.y.z -DSRCDIR=<app folder> -DOUTFILE=<setup.exe> installer.nsi
Unicode true
!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"

!define APPNAME   "Console Repair Atlas"
!define EXE       "Console Repair Atlas.exe"
!define UNINSTEXE "Uninstall Console Repair Atlas.exe"
!define UNINSTKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\ConsoleRepairAtlas"
!define REGKEY    "Software\ConsoleRepairAtlas"
!ifndef VERSION
  !define VERSION "0.0.0"
!endif

Name "${APPNAME}"
OutFile "${OUTFILE}"
InstallDir "$LOCALAPPDATA\Programs\${APPNAME}"
InstallDirRegKey HKCU "${REGKEY}" "InstallDir"
RequestExecutionLevel user
SetCompressor /SOLID lzma
SetCompressorDictSize 64
BrandingText "${APPNAME} v${VERSION}"
ShowInstDetails nevershow
ShowUninstDetails nevershow

VIProductVersion "${VERSION}.0"
VIAddVersionKey "ProductName" "${APPNAME}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "FileDescription" "${APPNAME} Setup"
VIAddVersionKey "LegalCopyright" "Console Repair Atlas"

; ---------------------------------------------------------------- pages
!define MUI_ICON   "app.ico"
!define MUI_UNICON "app.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Install ${APPNAME} v${VERSION}"
!define MUI_WELCOMEPAGE_TEXT "This will install ${APPNAME} — interactive diagrams, board views, part numbers, repair steps and replacement-part sources for video game consoles from the NES to today.$\r$\n$\r$\nIf ${APPNAME} is open, close it before continuing.$\r$\n$\r$\nClick Next to continue."
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
Page custom ShortcutsPage ShortcutsLeave
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\${EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APPNAME}"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\CHANGELOG.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show what's new in this version"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
UninstPage custom un.DataPage un.DataLeave
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; ---------------------------------------------------------------- shortcut options page
Var Dlg
Var ChkDesktop
Var ChkStart
Var WantDesktop
Var WantStart

Function .onInit
  StrCpy $WantDesktop ${BST_CHECKED}
  StrCpy $WantStart ${BST_CHECKED}
  ; silent-install switches:  /NODESKTOP  /NOSTARTMENU
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/NODESKTOP" $R1
  ${IfNot} ${Errors}
    StrCpy $WantDesktop ${BST_UNCHECKED}
  ${EndIf}
  ClearErrors
  ${GetOptions} $R0 "/NOSTARTMENU" $R1
  ${IfNot} ${Errors}
    StrCpy $WantStart ${BST_UNCHECKED}
  ${EndIf}
FunctionEnd

Function ShortcutsPage
  !insertmacro MUI_HEADER_TEXT "Shortcuts" "Choose where you want shortcuts to ${APPNAME}."
  nsDialogs::Create 1018
  Pop $Dlg
  ${If} $Dlg == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 20u "Do you want to create a desktop icon for ${APPNAME}?"
  Pop $0
  ${NSD_CreateCheckbox} 10u 24u 100% 12u "Yes, create a &desktop icon"
  Pop $ChkDesktop
  ${NSD_SetState} $ChkDesktop $WantDesktop
  ${NSD_CreateCheckbox} 10u 42u 100% 12u "Add ${APPNAME} to the &Start menu"
  Pop $ChkStart
  ${NSD_SetState} $ChkStart $WantStart
  ${NSD_CreateLabel} 0 70u 100% 24u "You can always add or remove these later. Uninstalling removes them automatically."
  Pop $0
  nsDialogs::Show
FunctionEnd

Function ShortcutsLeave
  ${NSD_GetState} $ChkDesktop $WantDesktop
  ${NSD_GetState} $ChkStart $WantStart
FunctionEnd

; ---------------------------------------------------------------- install
Section "Install"
  ; make sure the app isn't running (its files would be locked)
  check_running:
  FindWindow $0 "Chrome_WidgetWin_1" "${APPNAME}"
  ${If} $0 <> 0
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "${APPNAME} is running. Close it, then click Retry." /SD IDCANCEL IDRETRY check_running
    Abort
  ${EndIf}

  SetOutPath "$INSTDIR"
  ; clear the previous version's app files so nothing stale is left behind
  RMDir /r "$INSTDIR\resources\app"
  File /r "${SRCDIR}\*"
  File "app.ico"
  WriteUninstaller "$INSTDIR\${UNINSTEXE}"

  ${If} $WantDesktop == ${BST_CHECKED}
    CreateShortcut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${EXE}" "" "$INSTDIR\app.ico" 0 SW_SHOWNORMAL "" "Console repair diagrams and parts"
  ${Else}
    Delete "$DESKTOP\${APPNAME}.lnk"
  ${EndIf}
  ${If} $WantStart == ${BST_CHECKED}
    CreateShortcut "$SMPROGRAMS\${APPNAME}.lnk" "$INSTDIR\${EXE}" "" "$INSTDIR\app.ico" 0 SW_SHOWNORMAL "" "Console repair diagrams and parts"
  ${Else}
    Delete "$SMPROGRAMS\${APPNAME}.lnk"
  ${EndIf}

  ; Add/Remove Programs entry
  WriteRegStr HKCU "${REGKEY}" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINSTKEY}" "Publisher" "${APPNAME}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayIcon" "$INSTDIR\app.ico"
  WriteRegStr HKCU "${UNINSTKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTKEY}" "UninstallString" '"$INSTDIR\${UNINSTEXE}"'
  WriteRegStr HKCU "${UNINSTKEY}" "QuietUninstallString" '"$INSTDIR\${UNINSTEXE}" /S'
  WriteRegStr HKCU "${UNINSTKEY}" "URLInfoAbout" "https://github.com/phillipjhowe-hue/Interactive-video-game-console-schematics-and-parts"
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoRepair" 1
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKCU "${UNINSTKEY}" "EstimatedSize" "$0"
SectionEnd

; ---------------------------------------------------------------- uninstall
Var UnChkData
Var UnDelData

Function un.DataPage
  !insertmacro MUI_HEADER_TEXT "Your photos and notes" "Choose whether to keep the photos and notes you added."
  nsDialogs::Create 1018
  Pop $Dlg
  ${NSD_CreateLabel} 0 0 100% 30u "${APPNAME} keeps your board photos, part photos, hotspots and notes in your user profile. Keep them if you might reinstall later."
  Pop $0
  ${NSD_CreateCheckbox} 10u 36u 100% 12u "Also &delete my photos and notes"
  Pop $UnChkData
  nsDialogs::Show
FunctionEnd

Function un.DataLeave
  ${NSD_GetState} $UnChkData $UnDelData
FunctionEnd

Section "Uninstall"
  check_running_un:
  FindWindow $0 "Chrome_WidgetWin_1" "${APPNAME}"
  ${If} $0 <> 0
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "${APPNAME} is running. Close it, then click Retry." /SD IDCANCEL IDRETRY check_running_un
    Abort
  ${EndIf}

  Delete "$DESKTOP\${APPNAME}.lnk"
  Delete "$SMPROGRAMS\${APPNAME}.lnk"
  ; remove only the files this installer put there
  !include "uninstall_files.nsh"
  Delete "$INSTDIR\app.ico"
  Delete "$INSTDIR\${UNINSTEXE}"
  RMDir "$INSTDIR"

  ${If} $UnDelData == ${BST_CHECKED}
    RMDir /r "$APPDATA\${APPNAME}"
  ${EndIf}
  DeleteRegKey HKCU "${UNINSTKEY}"
  DeleteRegKey HKCU "${REGKEY}"
SectionEnd
