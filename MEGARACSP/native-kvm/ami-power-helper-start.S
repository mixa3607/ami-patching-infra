.global _start
.type _start, %function
_start:
	ldr r0, [sp]
	add r1, sp, #4
	bl power_main
	mov r7, #1
	svc #0
.size _start, .-_start
.section .note.GNU-stack,"",%progbits
