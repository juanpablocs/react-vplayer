export interface ManagerInterface {
    play(): void
    pause(): void
    changeSource(url:string, currentTime:number): void
    setSeek(currentTime:string): void
}