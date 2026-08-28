.global _start
.type _start, %function
_start:
    mov r0, sp
    bl loop_main
    mov r7, #1
    svc #0
