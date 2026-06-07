declare module "midtrans-client" {
  type MidtransClientOptions = {
    isProduction?: boolean
    serverKey: string
    clientKey: string
  }

  export class Snap {
    constructor(options: MidtransClientOptions)
    createTransaction(parameter: Record<string, unknown>): Promise<{ token?: string }>
  }

  export class CoreApi {
    constructor(options: MidtransClientOptions)
    transaction: {
      status: (orderId: string) => Promise<Record<string, unknown>>
    }
  }
}
