import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { CartDto } from 'src/dto/cart.dto';
import { QuantityUpdateDto } from 'src/dto/quantityUpdate.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { createCartEntity } from 'src/helpers/createCartEntity';
import { fillCartEntity } from 'src/helpers/fillCartEntity';
import { removeSubprodFromCart } from 'src/helpers/removeFromCart';
import { updateCartProducts } from 'src/helpers/updateCartProducts';
import { updateCartTotals } from 'src/helpers/updateCartTotals';
import { firebaseFirestore } from '../firebase/firebase.app';

@Injectable()
export class CartService {
  private cartCollection: CollectionReference;
  private prodCollection: CollectionReference;

  constructor() {
    this.cartCollection = firebaseFirestore.collection('cart');
    this.prodCollection = firebaseFirestore.collection('product');
  }

  async addToCart(
    subProduct: SubproductDto,
    idUser: string,
  ): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection
      .where('user', '==', idUser)
      .where('isActive', '!=', false)
      .get();

    if (cartDoc.empty) {
      const newCart = fillCartEntity(subProduct, idUser);
      const cartUser = this.cartCollection.doc();
      await cartUser.set(Object.assign({}, newCart));

      const cartSaved = await cartUser.get();
      const cartWithId = {
        id: cartSaved.id,
        user: newCart.user,
        products: newCart.products,
        totalPrice: newCart.totalPrice,
        totalProducts: newCart.totalProducts,
        created_at: newCart.created_at,
        updated_at: newCart.updated_at,
      };
      await cartUser.update(Object.assign({}, cartWithId));
      const finalCartSaved = await cartUser.get();
      Logger.log(cartWithId, 'Cart created');

      return finalCartSaved.data();
    } else {
      const cartId = cartDoc.docs[0].id;
      const cartRef = this.cartCollection.doc(cartId);
      const userCart = cartDoc.docs[0].data();

      const userCartUpdated = updateCartProducts(
        userCart,
        userCart.products,
        subProduct,
      );

      Logger.log(userCartUpdated, 'Cart updated');
      await cartRef.update(userCartUpdated);
      const cartUpdated = await cartRef.get();
      return cartUpdated.data();
    }
  }

  async getUserCart(idUser: string): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection
      .where('user', '==', idUser)
      .where('isActive', '!=', false)
      .get();
    if (cartDoc.empty) {
      return {};
    } else {
      const userCart = cartDoc.docs[0].data();
      for (const prod of userCart?.products) {
        const prodDoc: DocumentData = this.prodCollection.doc(prod.idProduct);
        const prodCart = await prodDoc.get().then((doc) => {
          return doc.data();
        });
        if (prodCart) prod.productName = prodCart.name;
      }
      Logger.log(userCart, 'Cart');
      return userCart;
    }
  }

  async addLocalCart(cartData: CartDto, idUser: string): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection
      .where('user', '==', idUser)
      .where('isActive', '!=', false)
      .get();
    if (cartDoc.empty) {
      const newCart = createCartEntity(cartData, idUser);
      const cartUser = this.cartCollection.doc();
      await cartUser.set(Object.assign({}, newCart));

      const cartSaved = await cartUser.get();
      const cartWithId = {
        id: cartSaved.id,
        user: newCart.user,
        products: newCart.products,
        totalPrice: newCart.totalPrice,
        totalProducts: newCart.totalProducts,
        created_at: newCart.created_at,
        updated_at: newCart.updated_at,
      };
      await cartUser.update(Object.assign({}, cartWithId));
      const finalCartSaved = await cartUser.get();
      Logger.log(finalCartSaved, 'Cart created');

      return finalCartSaved.data();
    } else {
      const cartId = cartDoc.docs[0].id;
      const cartRef = this.cartCollection.doc(cartId);
      const userCart = cartDoc.docs[0].data();

      let userCartUpdated: any;
      cartData.products.map((elem) => {
        userCartUpdated = updateCartProducts(userCart, userCart.products, elem);
      });

      await cartRef.update(userCartUpdated);
      const cartUpdated = await cartRef.get();
      Logger.log(cartUpdated, 'Local cart saved');

      return cartUpdated.data();
    }
  }

  async removeFromCart(
    subprod: SubproductDto,
    idUser: string,
  ): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection
      .where('user', '==', idUser)
      .where('isActive', '!=', false)
      .get();
    if (!cartDoc.empty) {
      const updatedCart = removeSubprodFromCart(
        subprod,
        cartDoc.docs[0].data(),
      );
      const cartId = cartDoc.docs[0].id;
      const cartRef = this.cartCollection.doc(cartId);

      await cartRef.update(updatedCart);

      Logger.log(updatedCart, 'Removed subprod cart');
      return updatedCart;
    }
  }

  async updateSubprodQuantity(
    subprodQuantity: QuantityUpdateDto,
    idUser: string,
  ): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection
      .where('user', '==', idUser)
      .where('isActive', '!=', false)
      .get();

    if (!cartDoc.empty) {
      const cartId = cartDoc.docs[0].id;
      const cartRef = this.cartCollection.doc(cartId);
      const userCart = cartDoc.docs[0].data();

      userCart.products.map((elem: SubproductDto) => {
        if (elem.id === subprodQuantity.idSubprod) {
          elem.quantity = subprodQuantity.newQuantity;
        }
      });
      const userCartUpdated = updateCartTotals(userCart);

      Logger.log(userCartUpdated, 'Cart updated');
      await cartRef.update(userCartUpdated);
      const cartUpdated = await cartRef.get();
      return cartUpdated.data();
    }
  }

  async getOrderCart(cartId: string): Promise<DocumentData> {
    const cartDoc: DocumentData = await this.cartCollection.doc(cartId).get();
    const cartToDisactive = cartDoc.data();
    const cartRef = this.cartCollection.doc(cartDoc.id);

    cartToDisactive.isActive = false;
    await cartRef.update(cartToDisactive);

    const cartUpdated = await cartRef.get();
    return cartUpdated.data();
  }
}
