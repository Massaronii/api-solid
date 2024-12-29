export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max nuumber of check-ins reached')
  }
}
