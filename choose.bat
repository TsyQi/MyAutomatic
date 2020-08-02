<# : choose.bat
:: launches a Directory... Open sort of path chooser and outputs choice(s) to the console

@echo off
setlocal enabledelayedexpansion

set local=BOOST CEFDIR QTDIR OPENCV OPENSSL PTHD_LIB86 JAVA_HOME ZLIB libPNG
set t=%local%
:loop
for /f "tokens=1*" %%a in ("%t%") do (
    echo Choose "%%a" path by select dialog
    for /f "delims=" %%I in ('powershell -noprofile "iex (${%~f0} | out-string)"') do (
        echo "%%a = %%~I"
	    setx %%a %%~I
    )
    set t=%%b
)
if defined t goto :loop
goto :EOF

: end Batch portion / begin PowerShell hybrid chimera #>

Add-Type -AssemblyName System.Windows.Forms
$f = new-object Windows.Forms.FolderBrowserDialog
[void]$f.ShowDialog()
$f.SelectedPath