export function groupBy<T, U>(keyExtractor: (object: T) => U, objects: T[]): Map<U, T[]> {
  return objects.reduce((rv: Map<U, T[]>, object: T) => {
    var values: T[] | undefined = rv.get(keyExtractor(object))
    if (values === undefined) {
      values = []
    }
    values.push(object)
    rv.set(keyExtractor(object), values)
    return rv
  }, new Map())
}

export function associateBy<T, U>(keyExtractor: (object: T) => U, objects: T[]): Map<U, T> {
  return objects.reduce((rv: Map<U, T>, object: T) => {
    const key = keyExtractor(object)
    if (rv.has(key)) {
      // Associate by expect the objects to be unique by their key.
      throw Error("Array has multiple values for key: " + key)
    }
    rv.set(key, object)
    return rv
  }, new Map())
}
