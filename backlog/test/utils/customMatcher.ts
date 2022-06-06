declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
  }
}

interface CustomMatchers<R = unknown> {
  toBeNullOr(classTypeOrNull: any): R
}

expect.extend({
  toBeNullOr(received, classTypeOrNull) {
    try {
      expect(received).toEqual(expect.any(classTypeOrNull))
      return {
        message: () => `Ok`,
        pass: true
      }
    } catch (error) {
      return received === null
        ? {
            message: () => `Ok`,
            pass: true
          }
        : {
            message: () => `expected ${received} to be ${classTypeOrNull} type or null`,
            pass: false
          }
    }
  }
})

export default global
