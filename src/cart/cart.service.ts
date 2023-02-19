import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CollectionReference, DocumentData, QuerySnapshot } from 'firebase-admin/firestore'
import { CartDto } from 'src/dto/cart.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { createCartEntity } from 'src/helpers/createCartEntity';
import { fillCartEntity } from 'src/helpers/fillCartEntity';
import { updateCartProducts } from 'src/helpers/updateCartProducts';
import { firebaseFirestore } from '../firebase/firebase.app';

@Injectable()
export class CartService {

  private cartCollection: CollectionReference
  private prodCollection: CollectionReference

  constructor() {
    this.cartCollection = firebaseFirestore.collection('cart')
    this.prodCollection = firebaseFirestore.collection('product')
  }

  async addToCart(subProduct: SubproductDto, idUser: string) {
    const cartDoc: DocumentData = await this.cartCollection.where('user', '==', idUser).get()

    if (cartDoc.empty) {
      const newCart = fillCartEntity(subProduct, idUser)
      const cartUser = this.cartCollection.doc();
      await cartUser.set(Object.assign({}, newCart));

      const cartSaved = await cartUser.get();

      return cartSaved.data();
    } else {
      const cartId = cartDoc.docs[0].id
      const cartRef = this.cartCollection.doc(cartId)
      const userCart = cartDoc.docs[0].data()

      const userCartUpdated = updateCartProducts(userCart, userCart.products, subProduct)

      await cartRef.update(userCartUpdated)
      const cartUpdated = await cartRef.get()
      return cartUpdated.data()
    }
  }

  async getUserCart(idUser: string) {
    const cartDoc: DocumentData = await this.cartCollection.where('user', '==', idUser).get()
    if (cartDoc.empty) {
      return {}
    } else {
      const userCart = cartDoc.docs[0].data()
      for (let prod of userCart?.products) {
        const prodDoc: DocumentData = this.prodCollection.doc(prod.idProduct)
        const prodCart = await prodDoc.get().then((doc) => { return doc.data() })
        prod.productName = prodCart.name
      }
      return userCart
    }
  }

  async addLocalCart(cartData: CartDto, idUser: string) {
    const cartDoc: DocumentData = await this.cartCollection.where('user', '==', idUser).get()
    if (cartDoc.empty) {
      const newCart = createCartEntity(cartData, idUser)
      const cartUser = this.cartCollection.doc();
      await cartUser.set(Object.assign({}, newCart));

      const cartSaved = await cartUser.get();

      return cartSaved.data();
    } else {
      const cartId = cartDoc.docs[0].id
      const cartRef = this.cartCollection.doc(cartId)
      const userCart = cartDoc.docs[0].data()

      let userCartUpdated
      cartData.products.map((elem) => {
        userCartUpdated = updateCartProducts(userCart, userCart.products, elem)
      })

      await cartRef.update(userCartUpdated)
      const cartUpdated = await cartRef.get()
      return cartUpdated.data()
    }
  }

}
